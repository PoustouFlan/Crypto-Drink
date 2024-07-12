package org.cryptodrink.domain.service;

import org.cryptodrink.converter.ScoreboardConverter;
import org.cryptodrink.data.model.ScoreboardModel;
import org.cryptodrink.data.model.UserModel;
import org.cryptodrink.data.repository.ScoreboardRepository;
import org.cryptodrink.data.repository.UserRepository;
import org.cryptodrink.domain.entity.ScoreboardEntity;
import org.cryptodrink.domain.entity.UserEntity;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.Optional;

@ApplicationScoped
public class ScoreboardService {
    @Inject
    ScoreboardRepository scoreboards;
    @Inject
    ScoreboardConverter scoreboardConverter;
    @Inject
    UserRepository users;

    public Optional<ScoreboardEntity> find(String name)
    {
        return scoreboards.find("LOWER(name)", name.toLowerCase())
                .firstResultOptional()
                .map(scoreboardConverter::convert);
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
}