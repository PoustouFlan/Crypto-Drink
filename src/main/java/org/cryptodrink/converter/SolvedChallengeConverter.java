package org.cryptodrink.converter;


import org.cryptodrink.data.model.SolvedChallengeModel;
import org.cryptodrink.domain.entity.SolvedChallengeEntity;
import org.cryptodrink.presentation.rest.response.SolvedChallengeResponse;
import org.cryptodrink.presentation.rest.response.SolvedUserResponse;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

@ApplicationScoped
public class SolvedChallengeConverter {
    @Inject
    ChallengeConverter challengeConverter;
    @Inject
    UserConverter userConverter;

    public SolvedChallengeEntity convert(SolvedChallengeModel solved)
    {
        return new SolvedChallengeEntity(
            solved.getDate(),
            userConverter.convert(solved.getUser()),
            challengeConverter.convert(solved.getChallenge())
        );
    }

    public SolvedChallengeResponse convertChallenge(SolvedChallengeEntity solved)
    {
        return new SolvedChallengeResponse(
                solved.getDate().toString(), // TODO format
                solved.getChallenge().getCategory(),
                solved.getChallenge().getName()
        );
    }

    public SolvedUserResponse convertUser(SolvedChallengeEntity solved)
    {
        return new SolvedUserResponse(
                solved.getDate().toString(), // TODO format
                solved.getUser().getUsername()
        );
    }
}