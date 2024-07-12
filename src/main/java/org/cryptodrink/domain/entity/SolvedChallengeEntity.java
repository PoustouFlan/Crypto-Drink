package org.cryptodrink.domain.entity;

import java.time.LocalDate;

public record SolvedChallengeEntity(
    LocalDate date,
    ChallengeEntity challenge
) {}