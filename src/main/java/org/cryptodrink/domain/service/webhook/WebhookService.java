package org.cryptodrink.domain.service.webhook;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.cryptodrink.domain.entity.*;
import org.cryptodrink.domain.service.ConfigService;
import org.cryptodrink.domain.service.ScoreboardService;
import org.cryptodrink.domain.service.UserService;
import org.cryptodrink.utils.I18nUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
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

    public void announce(SolvedChallengeEntity solve)
    {
        for (ScoreboardEntity scoreboard : userService.getScoreboards(solve.getUser()))
        {
            for (WebhookEntity webhook : scoreboardService.getWebhooks(scoreboard))
            {
                sendNotification(webhook.getUrl(), scoreboard, solve);
            }
        }
    }

    private void sendNotification(String url, ScoreboardEntity scoreboard, SolvedChallengeEntity solve)
    {
        UserEntity user = solve.getUser();
        ChallengeEntity challenge = solve.getChallenge();

        HttpClient client = HttpClient.newHttpClient();
        ObjectMapper mapper = new ObjectMapper();
        try {
            WebhookRequest payload = new WebhookRequest();
            // payload.setContent("Nouveau flag !");
            WebhookRequest.Embed embed = new WebhookRequest.Embed();
            embed.setTitle("Nouveau flag !");
            embed.setColor(16711680);

            WebhookRequest.Embed.Field headerField = new WebhookRequest.Embed.Field();
            headerField.setName("Flagger");
            headerField.setValue(String.format(
                    """
                                        :flag_fr: [%s](https://www.crypto-drink.com/scoreboard/%s/user/%s)
                        :star: %d\t:triangular_flag_on_post: %d
                        Niveau : %d
                                        Rang : #%d / %d
                    """,
                    user.getUsername(), scoreboard.getName(), user.getUsername(),
                    user.getScore(), userService.getSolvedChallenges(user).size(),
                    user.getLevel(),
                    user.getRank(), configService.getTotalUser()
            ));

            WebhookRequest.Embed.Field field = new WebhookRequest.Embed.Field();
            field.setName(challenge.getCategory().getName());
            field.setValue(String.format(
                    """
                                        [%s](https://www.crypto-drink.com/scoreboard/%s/category/%s/%s)
                        :star: %d\t:triangular_flag_on_post: %d
                                        %s :triangular_flag_on_post: du scoreboard [%s](https://www.crypto-drink.com/scoreboard/%s)
                    """,
                    challenge.getName(), scoreboard.getName(),
                    URLEncoder.encode(challenge.getCategory().getName(), StandardCharsets.UTF_8),
                    URLEncoder.encode(challenge.getName(), StandardCharsets.UTF_8),
                    challenge.getPoints(), challenge.getSolves(),
                    I18nUtils.toOrdinal(scoreboardService.countSolvers(scoreboard, challenge)),
                    scoreboard.getName(), scoreboard.getName()
            ));
            field.setInline(false);

            embed.setFields(List.of(headerField, field));
            embed.setTimestamp(solve.getDate().toString());
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
