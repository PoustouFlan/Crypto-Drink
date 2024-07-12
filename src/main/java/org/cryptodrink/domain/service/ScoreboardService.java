package org.cryptodrink.domain.service;

import org.cryptodrink.converter.ScoreboardConverter;
import org.cryptodrink.data.repository.ScoreboardRepository;
import org.cryptodrink.domain.entity.ScoreboardEntity;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.Optional;

@ApplicationScoped
public class ScoreboardService {
    @Inject
    ScoreboardRepository scoreboards;
    @Inject
    ScoreboardConverter scoreboardConverter;

    public Optional<ScoreboardEntity> find(String name)
    {
        return scoreboards.find("name", name)
                .firstResultOptional()
                .map(scoreboardConverter::convert);
    }
}