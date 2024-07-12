package org.cryptodrink.data.model;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "webhooks")
@Data
public class WebhookModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String url;

    @ManyToOne
    @JoinColumn(name = "webhooks")
    private ScoreboardModel scoreboard;
}
