package org.cryptodrink.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WebhookEntity {
    private Long id;
    private String url;
    private ScoreboardEntity scoreboard;
}
