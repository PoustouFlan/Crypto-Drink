package org.cryptodrink.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class UserEntity {
    private Long id;
    private String username;
    private String country;
    private Integer firstBloods;
    private LocalDate joined;
    private Integer level;
    private Integer rank;
    private Integer score;
    private String website;
    private Instant lastRefreshed;
}
