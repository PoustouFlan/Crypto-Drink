package org.cryptodrink.converter;

import io.vertx.ext.auth.User;
import org.cryptodrink.data.model.ScoreboardModel;
import org.cryptodrink.data.repository.UserRepository;
import org.cryptodrink.domain.entity.ScoreboardEntity;
import org.cryptodrink.domain.entity.UserEntity;
import org.cryptodrink.presentation.rest.response.ScoreboardResponse;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

@ApplicationScoped
public class ScoreboardConverter {
    @Inject
    UserConverter userConverter;

    @Inject
    WebhookConverter webhookConverter;

    public ScoreboardEntity convert(ScoreboardModel scoreboard)
    {
        return new ScoreboardEntity(
                scoreboard.getId(),
                scoreboard.getName(),
                userConverter.convert(scoreboard.getOwner()),
                scoreboard.getIsPublic(),
                scoreboard.getUsers().stream().map(userConverter::convert).toList()
        );
    }

    public ScoreboardResponse convert(ScoreboardEntity scoreboard)
    {
        return new ScoreboardResponse(
                scoreboard.getName(),
                scoreboard.getOwner().getUsername(),
                scoreboard.getIsPublic(),
                scoreboard.getUsers().stream().map(UserEntity::getUsername).toList()
        );
    }
}
