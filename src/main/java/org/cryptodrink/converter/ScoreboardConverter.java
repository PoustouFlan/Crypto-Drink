package org.cryptodrink.converter;

import org.cryptodrink.data.model.ScoreboardModel;
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
                scoreboard.getUsers().stream().map(userConverter::convert).toList()
        );
    }

    public ScoreboardResponse convert(ScoreboardEntity scoreboard)
    {
        return new ScoreboardResponse(
                scoreboard.getName(),
                scoreboard.getUsers().stream().map(UserEntity::getUsername).toList()
        );
    }
}
