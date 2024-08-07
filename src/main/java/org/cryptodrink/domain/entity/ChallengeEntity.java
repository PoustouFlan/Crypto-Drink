package org.cryptodrink.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChallengeEntity {
    private Long id;
    private CategoryEntity category;
    private String name;
    private Integer points;
    private Integer solves;
}