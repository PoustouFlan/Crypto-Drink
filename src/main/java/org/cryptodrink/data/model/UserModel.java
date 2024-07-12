package org.cryptodrink.data.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
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
}
