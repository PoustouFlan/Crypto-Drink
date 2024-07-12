package org.cryptodrink.domain.service;

import org.cryptodrink.converter.ChallengeConverter;
import org.cryptodrink.converter.SolvedChallengeConverter;
import org.cryptodrink.data.model.ChallengeModel;
import org.cryptodrink.data.repository.ChallengeRepository;
import org.cryptodrink.domain.entity.ChallengeEntity;
import org.cryptodrink.domain.entity.SolvedChallengeEntity;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class ChallengeService {
    @Inject
    ChallengeRepository challenges;
    @Inject
    ChallengeConverter challengeConverter;
    @Inject
    SolvedChallengeConverter solvedChallengeConverter;

    public Optional<ChallengeEntity> find(String category, String name)
    {
        return challenges
                .find("category = ?1 AND name = ?2", category, name)
                .firstResultOptional()
                .map(challengeConverter::convert);
    }

    public List<SolvedChallengeEntity> getFlaggers(ChallengeEntity challenge)
    {
        ChallengeModel model = challenges.findById(challenge.getId());
        return model.getSolvedChallenges().stream().map(solvedChallengeConverter::convert).toList();
    }
}
