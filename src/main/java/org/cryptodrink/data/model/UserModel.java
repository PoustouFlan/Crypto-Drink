package org.cryptodrink.data.model;

import lombok.Data;

import javax.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
public class UserModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String country;
    private Integer firstBloods;
    private LocalDate joined;
    private Integer level;
    private Integer rank;
    private Integer score;
    private String website;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SolvedChallengeModel> solvedChallenges = new ArrayList<>();

    @ManyToMany(mappedBy = "users")
    private List<ScoreboardModel> scoreboards = new ArrayList<>();

    private Instant lastRefreshed;
}
