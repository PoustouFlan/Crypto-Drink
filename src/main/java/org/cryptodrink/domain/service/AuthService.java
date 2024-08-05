package org.cryptodrink.domain.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.cryptodrink.domain.entity.UserEntity;
import org.cryptodrink.presentation.rest.response.TokenResponse;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;
import java.util.Optional;

@ApplicationScoped
public class AuthService {

    @ConfigProperty(name = "cryptodrink.hmac-key-path")
    String hmacKeyPath;

    @ConfigProperty(name = "cryptodrink.auth-url")
    String authUrl;

    @Inject
    UserService userService;

    public String getHMACKey() throws IOException, NoSuchAlgorithmException {
        Path path = Paths.get(hmacKeyPath);
        if (Files.exists(path)) {
            return Files.readString(path);
        } else {
            return generateAndStoreHMACKey(path);
        }
    }

    private String generateAndStoreHMACKey(Path path) throws NoSuchAlgorithmException, IOException {
        SecureRandom random = SecureRandom.getInstanceStrong();
        byte[] key = new byte[32];
        random.nextBytes(key);
        String encodedKey = Base64.getEncoder().encodeToString(key);
        Files.createDirectories(path.getParent());
        Files.writeString(path, encodedKey);
        return encodedKey;
    }

    public TokenResponse generateToken() throws Exception {
        String key = getHMACKey();

        String randomValue = generateRandomValue();
        Instant expiration = Instant.now().plus(1, ChronoUnit.HOURS);
        String payload = randomValue + "|" + expiration.toString();

        String token = createHMACToken(payload, key);
        return new TokenResponse(token, payload);
    }

    public boolean verifyToken(String username, String payload) throws Exception {
        String key = getHMACKey();

        String token = createHMACToken(payload, key);

        return checkTokenOnCryptoHack(username, token);
    }

    public String generateJWT(String username) throws IOException, NoSuchAlgorithmException {
        String key = getHMACKey();
        Key signingKey = Keys.hmacShaKeyFor(key.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .subject(username)
                .expiration(Date.from(Instant.now().plus(1, ChronoUnit.MONTHS)))
                .signWith(signingKey)
                .compact();
    }

    private Boolean checkTokenOnCryptoHack(String username, String token) {
        UserEntity user = userService.find(username, false, true);
        if (user == null)
            return false;
        return user.getWebsite().equals(token);
    }

    private String generateRandomValue() {
        byte[] array = new byte[16];
        new SecureRandom().nextBytes(array);
        return Base64.getEncoder().encodeToString(array);
    }

    private String createHMACToken(String payload, String key) throws InvalidKeyException, NoSuchAlgorithmException {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] hmacBytes = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        return authUrl + "/" + Base64.getEncoder().encodeToString(hmacBytes);
    }
}
