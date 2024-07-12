package org.cryptodrink.data.model;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "solved_challenges")
@Data
public class SolvedChallengeModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserModel user;

    @ManyToOne
    @JoinColumn(name = "challenge_id")
    private ChallengeModel challenge;

    private LocalDate date;
}
