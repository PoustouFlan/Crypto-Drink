package org.cryptodrink.data.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import lombok.NoArgsConstructor;
import org.cryptodrink.data.model.ScoreboardModel;

import javax.enterprise.context.ApplicationScoped;

@ApplicationScoped
@NoArgsConstructor
public class ScoreboardRepository implements PanacheRepository<ScoreboardModel> {
}
