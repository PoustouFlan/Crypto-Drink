package org.cryptodrink.data.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import lombok.NoArgsConstructor;
import org.cryptodrink.data.model.ChallengeModel;

import javax.enterprise.context.ApplicationScoped;

@ApplicationScoped
@NoArgsConstructor
public class ChallengeRepository implements PanacheRepository<ChallengeModel> {
}
