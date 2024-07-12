package org.cryptodrink.data.model;

import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "challenges")
@Data
public class ChallengeModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;
    private String name;
    private Integer points;
    private Integer solves;

    @OneToMany(mappedBy = "challenge", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SolvedChallengeModel> solvedChallenges = new ArrayList<>();
}