package org.cryptodrink.converter;


import org.cryptodrink.data.model.SolvedChallengeModel;
import org.cryptodrink.domain.entity.SolvedChallengeEntity;
import org.cryptodrink.presentation.rest.response.SolvedChallengeResponse;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

@ApplicationScoped
public class SolvedChallengeConverter {
    @Inject
    ChallengeConverter challengeConverter;

    public SolvedChallengeEntity convert(SolvedChallengeModel solved)
    {
        return new SolvedChallengeEntity(
            solved.getDate(), challengeConverter.convert(solved.getChallenge())
        );
    }

    public SolvedChallengeResponse convert(SolvedChallengeEntity solved)
    {
        return new SolvedChallengeResponse(
                solved.date().toString(), // TODO format
                solved.challenge().getCategory(),
                solved.challenge().getName()
        );
    }
}