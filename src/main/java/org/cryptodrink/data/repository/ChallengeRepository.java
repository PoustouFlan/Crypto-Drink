package org.cryptodrink.data.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import org.cryptodrink.data.model.ChallengeModel;

import javax.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ChallengeRepository implements PanacheRepository<ChallengeModel> {
}
