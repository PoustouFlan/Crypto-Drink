package org.cryptodrink.domain.service;

import org.cryptodrink.converter.ScoreboardConverter;
import org.cryptodrink.data.model.ScoreboardModel;
import org.cryptodrink.data.model.UserModel;
import org.cryptodrink.data.repository.ScoreboardRepository;
import org.cryptodrink.domain.entity.ScoreboardEntity;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Optional;

@ApplicationScoped
public class ScoreboardService {
    @Inject
    ScoreboardRepository scoreboards;
    @Inject
    ScoreboardConverter scoreboardConverter;

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
}