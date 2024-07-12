package org.cryptodrink.converter;

import org.cryptodrink.data.model.WebhookModel;
import org.cryptodrink.domain.entity.WebhookEntity;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

@ApplicationScoped
public class WebhookConverter {
    @Inject
    ScoreboardConverter scoreboardConverter;

    public WebhookEntity convert(WebhookModel webhook)
    {
        return new WebhookEntity(
                webhook.getId(),
                webhook.getUrl(),
                scoreboardConverter.convert(webhook.getScoreboard())
        );
    }
}
