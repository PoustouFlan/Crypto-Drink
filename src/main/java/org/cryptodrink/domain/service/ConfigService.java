package org.cryptodrink.domain.service;

import org.cryptodrink.data.model.ConfigModel;
import org.cryptodrink.data.repository.ConfigRepository;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.Optional;

@ApplicationScoped
public class ConfigService {
    @Inject
    ConfigRepository config;

    public void setTotalUser(Integer totalUser)
    {
        Optional<ConfigModel> query = config.find("key", "total_user").firstResultOptional();
        if (query.isEmpty()) {
            ConfigModel setting = new ConfigModel();
            setting.setKey("total_user");
            setting.setValue(totalUser);
            config.persist(setting);
        }
        else {
            query.get().setValue(totalUser);
            config.persist(query.get());
        }
    }

    public Integer getTotalUser()
    {
        Optional<ConfigModel> query = config.find("key", "total_user").firstResultOptional();
        return query.map(ConfigModel::getValue).orElse(null);
    }
}
