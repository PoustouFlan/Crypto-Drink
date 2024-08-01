package org.cryptodrink.data.model;

import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "scoreboards")
@Data
public class ScoreboardModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @OneToOne
    private UserModel owner;
    private Boolean isPublic;

    @ManyToMany
    @JoinTable(
            name = "scoreboard_users",
            joinColumns = @JoinColumn(name = "scoreboard_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<UserModel> users = new ArrayList<>();

    @OneToMany(mappedBy = "scoreboard", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WebhookModel> webhooks = new ArrayList<>();
}