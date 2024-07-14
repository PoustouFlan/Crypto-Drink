package org.cryptodrink.data.repository;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import org.cryptodrink.data.model.ConfigModel;

import javax.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ConfigRepository implements PanacheRepository<ConfigModel> {
}