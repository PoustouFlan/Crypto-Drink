package org.cryptodrink.data.repository;


import io.quarkus.hibernate.orm.panache.PanacheRepository;
import lombok.NoArgsConstructor;
import org.cryptodrink.data.model.WebhookModel;

import javax.enterprise.context.ApplicationScoped;

@ApplicationScoped
@NoArgsConstructor
public class WebhookRepository implements PanacheRepository<WebhookModel> {
}
