package org.cryptodrink.domain.service;

import org.cryptodrink.domain.entity.ChallengeEntity;
import org.cryptodrink.domain.entity.ScoreboardEntity;
import org.cryptodrink.domain.entity.UserEntity;
import org.cryptodrink.domain.entity.WebhookEntity;
import org.cryptodrink.domain.service.cryptohack.CryptoHackAPI;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@ApplicationScoped
public class WebhookService {
    private static final Logger logger = LoggerFactory.getLogger(WebhookService.class);

    @Inject
    UserService userService;
    @Inject
    ScoreboardService scoreboardService;

    public void announce(UserEntity user, ChallengeEntity challenge)
    {
        for (ScoreboardEntity scoreboard : userService.getScoreboards(user))
        {
            for (WebhookEntity webhook : scoreboardService.getWebhooks(scoreboard))
            {
                sendNotification(webhook.getUrl(), user, challenge);
            }
        }
    }

    private void sendNotification(String url, UserEntity user, ChallengeEntity challenge)
    {
        HttpClient client = HttpClient.newHttpClient();
        String message = String.format("User %s has solved %s/%s", user.getUsername(), challenge.getCategory(), challenge.getName());
        String payload = String.format("{\"content\":\"%s\"}", message);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(payload))
                .build();
        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 204) {
                logger.error("Failed to send webhook notification. Response: {}", response.body());
            }
        } catch (IOException | InterruptedException e) {
            logger.error("Failed to send webhook notification", e);
        }
    }
}
