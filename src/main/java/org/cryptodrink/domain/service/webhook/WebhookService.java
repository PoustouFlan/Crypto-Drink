package org.cryptodrink.domain.service.webhook;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.cryptodrink.domain.entity.ChallengeEntity;
import org.cryptodrink.domain.entity.ScoreboardEntity;
import org.cryptodrink.domain.entity.UserEntity;
import org.cryptodrink.domain.entity.WebhookEntity;
import org.cryptodrink.domain.service.ConfigService;
import org.cryptodrink.domain.service.ScoreboardService;
import org.cryptodrink.domain.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.OffsetDateTime;
import java.util.List;

@ApplicationScoped
public class WebhookService {
    private static final Logger logger = LoggerFactory.getLogger(WebhookService.class);

    @Inject
    UserService userService;
    @Inject
    ScoreboardService scoreboardService;
    @Inject
    ConfigService configService;

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
        ObjectMapper mapper = new ObjectMapper();
        try {
            WebhookRequest payload = new WebhookRequest();
            payload.setContent("Nouveau flag !");
            WebhookRequest.Embed embed = new WebhookRequest.Embed();
            embed.setTitle("Flagger");
            embed.setDescription(String.format(
                    """
                        :flag_fr: %s
                        :star: %d\t:triangular_flag_on_post: TODO
                        Niveau : %d
                        Rang : %d / %d
                    """,
                    user.getUsername(),
                    user.getScore(),
                    user.getLevel(),
                    user.getRank(), configService.getTotalUser()
            ));

            WebhookRequest.Embed.Field field = new WebhookRequest.Embed.Field();
            field.setName(challenge.getCategory());
            field.setValue(String.format(
                    """
                        %s
                        :star: %d\t:triangular_flag_on_post: %d
                        TODOe :triangular_flag_on_post: du scoreboard
                    """,
                    challenge.getName(),
                    challenge.getPoints(), challenge.getSolves()
            ));
            field.setInline(false);

            embed.setFields(List.of(field));
            embed.setTimestamp(OffsetDateTime.now().toString());
            payload.setEmbeds(List.of(embed));

            String message = mapper.writeValueAsString(payload);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(message))
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 204) {
                logger.error("Failed to send webhook notification. Response: {}", response.body());
            }
    } catch (IOException | InterruptedException e) {
        logger.error("Failed to send webhook notification", e);
            throw new RuntimeException(e);
        }
    }
}
