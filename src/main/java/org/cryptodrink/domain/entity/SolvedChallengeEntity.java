package org.cryptodrink.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class SolvedChallengeEntity {
    private LocalDate date;
    private UserEntity user;
    private ChallengeEntity challenge;
}