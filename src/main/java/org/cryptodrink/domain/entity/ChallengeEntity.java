package org.cryptodrink.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
public class ChallengeEntity {
    private Long id;
    private String category;
    private String name;
    private Integer points;
    private Integer solves;
}