package org.cryptodrink.domain.service.cryptohack;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.cryptodrink.converter.ChallengeConverter;
import org.cryptodrink.converter.SolvedChallengeConverter;
import org.cryptodrink.converter.UserConverter;
import org.cryptodrink.data.model.CategoryModel;
import org.cryptodrink.data.model.ChallengeModel;
import org.cryptodrink.data.model.SolvedChallengeModel;
import org.cryptodrink.data.model.UserModel;
import org.cryptodrink.data.repository.CategoryRepository;
import org.cryptodrink.data.repository.ChallengeRepository;
import org.cryptodrink.data.repository.UserRepository;
import org.cryptodrink.domain.service.ConfigService;
import org.cryptodrink.domain.service.webhook.WebhookService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class CryptoHackAPI {
    private static final Logger logger = LoggerFactory.getLogger(CryptoHackAPI.class);
    private static final String API_URL = "https://cryptohack.org/api/user/";

    @Inject
    SolvedChallengeConverter solvedChallengeConverter;

    @Inject
    UserRepository users;

    @Inject
    ChallengeRepository challenges;

    @Inject
    UserConverter userConverter;

    @Inject
    ChallengeConverter challengeConverter;

    @Inject
    WebhookService webhookService;

    @Inject
    ConfigService configService;

    @Inject
    CategoryRepository categories;

    public Optional<CryptoHackResponse> getUserInfo(String username)
    {
        logger.debug("Calling CryptoHack API for user {}", username);
        URI Uri;
        try {
            Uri = URI.create(API_URL + username + "/");
        }
        catch (IllegalArgumentException e)
        {
            logger.error("Illegal Username {}", username);
            return Optional.empty();
        }

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(Uri)
                .GET()
                .build();
        HttpResponse<String> response;
        try {
            response = client.send(request, HttpResponse.BodyHandlers.ofString());
        } catch (IOException | InterruptedException e) {
            logger.error("Failed to Send API Request to {}", Uri);
            return Optional.empty();
        }
        if (response.statusCode() != 200)
        {
            logger.error("API Request to {} failed with {}", Uri, response);
            return Optional.empty();
        }
        ObjectMapper mapper = new ObjectMapper();
        logger.debug(response.body());
        try {
            return Optional.ofNullable(mapper.readValue(response.body(), CryptoHackResponse.class));
        } catch (JsonProcessingException e) {
            logger.error("Failed to parse the API result to {}", Uri);
            return Optional.empty();
        }
    }

    public void updateUserInfo(String username) {
        Optional<CryptoHackResponse> response = getUserInfo(username);
        if (response.isEmpty())
            return;
        logger.debug("Updating entry for user {} in database", username);
        CryptoHackResponse userInfo = response.get();
        saveUserInfo(userInfo);
    }

    @Transactional
    public void saveUserInfo(CryptoHackResponse userInfo) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");

        configService.setTotalUser(userInfo.getUserCount());
        UserModel user = users
                .find("LOWER(username)", userInfo.getUsername().toLowerCase())
                .firstResultOptional().orElse(new UserModel());
        user.setUsername(userInfo.getUsername());
        user.setCountry(userInfo.getCountry());
        user.setFirstBloods(userInfo.getFirstBloods());
        user.setJoined(LocalDate.parse(userInfo.getJoined(), formatter));
        user.setLevel(userInfo.getLevel());
        user.setRank(userInfo.getRank());
        user.setScore(userInfo.getScore());
        user.setWebsite(userInfo.getWebsite());
        user.setLastRefreshed(Instant.now());
        users.persist(user);

        List<SolvedChallengeModel> solvedChallenges = user.getSolvedChallenges();
        List<SolvedChallengeModel> newSolved = new ArrayList<>();

        for (CryptoHackResponse.SolvedChallenge solved : userInfo.getSolvedChallenges())
        {
            CategoryModel category = categories.find("name", solved.getCategory())
                    .firstResultOptional().orElse(new CategoryModel());
            category.setName(solved.getCategory());
            categories.persist(category);

            ChallengeModel challenge = challenges.find("name = ?1 AND category.id = ?2", solved.getName(), category.getId())
                    .firstResultOptional().orElse(new ChallengeModel());
            challenge.setCategory(category);
            challenge.setName(solved.getName());
            challenge.setPoints(solved.getPoints());
            challenge.setSolves(solved.getSolves());
            challenges.persist(challenge);

            SolvedChallengeModel solvedChallenge = new SolvedChallengeModel();
            solvedChallenge.setUser(user);
            solvedChallenge.setChallenge(challenge);
            solvedChallenge.setDate(LocalDate.parse(solved.getDate(), formatter));
            newSolved.add(solvedChallenge);
        }

        // Check that no challenge disappeared from the solved challenge of the user
        // If a challenge disappeared, this may mean the challenge has been renamed.
        // In that case, announces are silenced.
        boolean anyChallengeLost = false;
        for (SolvedChallengeModel solved : solvedChallenges)
        {
            if (newSolved.stream().noneMatch(s -> s.getChallenge().getId().equals(solved.getChallenge().getId()))) {
                logger.warn("User {} unsolved challenge {}/{}",
                        userInfo.getUsername(),
                        solved.getChallenge().getCategory(), solved.getChallenge().getName());
                anyChallengeLost = true;
            }
        }

        List<SolvedChallengeModel> toAnnounce = new ArrayList<>();
        for (SolvedChallengeModel solved : newSolved) {
            if (solvedChallenges.stream().noneMatch(s -> s.getChallenge().getId().equals(solved.getChallenge().getId()))) {
                if (!anyChallengeLost)
                    toAnnounce.add(solved);
                else
                    logger.warn("User {} solve for challenge {}/{} silenced",
                            userInfo.getUsername(),
                            solved.getChallenge().getCategory(), solved.getChallenge().getName());
            }
        }

        solvedChallenges.clear();
        solvedChallenges.addAll(newSolved);
        users.persist(user);

        toAnnounce.forEach(solved -> webhookService.announce(solvedChallengeConverter.convert(solved)));
    }
}