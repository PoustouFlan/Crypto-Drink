package org.cryptodrink.converter;

import org.cryptodrink.data.model.ChallengeModel;
import org.cryptodrink.domain.entity.ChallengeEntity;
import org.cryptodrink.domain.entity.SolvedChallengeEntity;
import org.cryptodrink.domain.service.ChallengeService;
import org.cryptodrink.presentation.rest.response.ChallengeResponse;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.List;

@ApplicationScoped
public class ChallengeConverter {
    @Inject
    ChallengeService challengeService;

    @Inject
    SolvedChallengeConverter solvedChallengeConverter;

    public ChallengeEntity convert(ChallengeModel challenge)
    {
        return new ChallengeEntity(
                challenge.getId(),
                challenge.getCategory(),
                challenge.getName(),
                challenge.getPoints(),
                challenge.getSolves()
        );
    }

    public ChallengeResponse convert(ChallengeEntity challenge)
    {
        List<SolvedChallengeEntity> flaggers = challengeService.getFlaggers(challenge);
        return new ChallengeResponse(
                challenge.getCategory(),
                challenge.getName(),
                challenge.getPoints(),
                challenge.getSolves(),
                flaggers.stream().map(solvedChallengeConverter::convertUser).toList()
        );
    }
}