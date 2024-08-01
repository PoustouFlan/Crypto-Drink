package org.cryptodrink.domain.service;

import org.cryptodrink.converter.ChallengeConverter;
import org.cryptodrink.converter.SolvedChallengeConverter;
import org.cryptodrink.data.model.ChallengeModel;
import org.cryptodrink.data.repository.ChallengeRepository;
import org.cryptodrink.domain.entity.ChallengeEntity;
import org.cryptodrink.domain.entity.ScoreboardEntity;
import org.cryptodrink.domain.entity.SolvedChallengeEntity;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.List;

@ApplicationScoped
public class ChallengeService {
    @Inject
    ChallengeRepository challenges;
    @Inject
    ChallengeConverter challengeConverter;
    @Inject
    SolvedChallengeConverter solvedChallengeConverter;
    @Inject
    CategoryService categoryService;

    public ChallengeEntity find(String category, String name)
    {
        ChallengeModel challenge = challenges
                .find("category.name = ?1 AND name = ?2", category, name)
                .firstResult();
        if (challenge == null)
            return null;
        return challengeConverter.convert(challenge);
    }

    public List<SolvedChallengeEntity> getFlaggers(ChallengeEntity challenge)
    {
        ChallengeModel model = challenges.findById(challenge.getId());
        return model.getSolvedChallenges().stream().map(solvedChallengeConverter::convert).toList();
    }

    public List<SolvedChallengeEntity> getFlaggers(ChallengeEntity challenge, ScoreboardEntity scoreboard) {
        ChallengeModel model = challenges.findById(challenge.getId());
        return model.getSolvedChallenges().stream()
                .filter(s -> scoreboard.getUsers().stream().anyMatch(u -> u.getId().equals(s.getUser().getId())))
                .map(solvedChallengeConverter::convert).toList();
    }
}
