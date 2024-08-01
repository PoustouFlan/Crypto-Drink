package org.cryptodrink.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ScoreboardEntity {
    private Long id;
    private String name;
    private UserEntity owner;
    private Boolean isPublic;
    private List<UserEntity> users;
}