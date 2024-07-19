package org.cryptodrink.domain.service;

import org.cryptodrink.converter.ScoreboardConverter;
import org.cryptodrink.converter.WebhookConverter;
import org.cryptodrink.data.model.ScoreboardModel;
import org.cryptodrink.data.model.UserModel;
import org.cryptodrink.data.model.WebhookModel;
import org.cryptodrink.data.repository.ScoreboardRepository;
import org.cryptodrink.data.repository.UserRepository;
import org.cryptodrink.data.repository.WebhookRepository;
import org.cryptodrink.domain.entity.ChallengeEntity;
import org.cryptodrink.domain.entity.ScoreboardEntity;
import org.cryptodrink.domain.entity.UserEntity;
import org.cryptodrink.domain.entity.WebhookEntity;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class ScoreboardService {
    @Inject
    ScoreboardRepository scoreboards;
    @Inject
    WebhookRepository webhooks;
    @Inject
    ScoreboardConverter scoreboardConverter;
    @Inject
    WebhookConverter webhookConverter;
    @Inject
    UserRepository users;
    @Inject
    UserService userService;

    public Long countSolvers(ScoreboardEntity scoreboard, ChallengeEntity challenge)
    {
        return scoreboard.getUsers().stream().filter(
               user -> userService.getSolvedChallenges(user).stream().anyMatch(
                       c -> c.getChallenge().getId().equals(challenge.getId())
               )
        ).count();
    }

    public List<ScoreboardEntity> getAll() {
        return scoreboards.listAll().stream().map(scoreboardConverter::convert).toList();
    }

    public Optional<ScoreboardEntity> find(String name)
    {
        return scoreboards.find("LOWER(name)", name.toLowerCase())
                .firstResultOptional()
                .map(scoreboardConverter::convert);
    }

    @Transactional
    public Optional<ScoreboardEntity> findAndDelete(String name) {
        Optional<ScoreboardModel> model = scoreboards.find("LOWER(name)", name.toLowerCase())
                .firstResultOptional();
        if (model.isEmpty())
            return Optional.empty();
        scoreboards.deleteById(model.get().getId());
        return Optional.of(scoreboardConverter.convert(model.get()));
    }

    @Transactional
    public Optional<ScoreboardEntity> create(String name)
    {
        ScoreboardModel model = new ScoreboardModel();
        model.setName(name);
        scoreboards.persist(model);
        return Optional.of(scoreboardConverter.convert(model));
    }

    @Transactional
    public ScoreboardEntity subscribeUser(ScoreboardEntity scoreboard, UserEntity user)
    {
        if (scoreboard.getUsers().stream().anyMatch(existingUser -> existingUser.getId() == user.getId()))
            return scoreboard;
        ScoreboardModel scoreboardModel = scoreboards.findById(scoreboard.getId());
        UserModel userModel = users.findById(user.getId());
        scoreboardModel.getUsers().add(userModel);
        scoreboards.persist(scoreboardModel);
        return scoreboardConverter.convert(scoreboardModel);
    }

    @Transactional
    public ScoreboardEntity addWebhook(ScoreboardEntity scoreboard, String url)
    {
        if (getWebhooks(scoreboard).stream().anyMatch(webhook -> webhook.getUrl().equalsIgnoreCase(url)))
            return scoreboard;
        ScoreboardModel scoreboardModel = scoreboards.findById(scoreboard.getId());
        WebhookModel webhook = new WebhookModel();
        webhook.setUrl(url);
        webhook.setScoreboard(scoreboardModel);
        webhooks.persist(webhook);
        scoreboardModel.getWebhooks().add(webhook);
        scoreboards.persist(scoreboardModel);
        return scoreboardConverter.convert(scoreboardModel);
    }

    public List<WebhookEntity> getWebhooks(ScoreboardEntity scoreboard)
    {
        ScoreboardModel model = scoreboards.findById(scoreboard.getId());
        return model.getWebhooks().stream().map(webhookConverter::convert).toList();
    }
}