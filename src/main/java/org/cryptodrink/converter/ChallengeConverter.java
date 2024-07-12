package org.cryptodrink.converter;

import org.cryptodrink.data.model.ChallengeModel;
import org.cryptodrink.domain.entity.ChallengeEntity;

import javax.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ChallengeConverter {
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
}