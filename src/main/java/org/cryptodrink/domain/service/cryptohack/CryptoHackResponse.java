package org.cryptodrink.domain.service.cryptohack;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class CryptoHackResponse {
    @JsonProperty("country")
    private String country;

    @JsonProperty("first_bloods")
    private Integer firstBloods;

    @JsonProperty("joined")
    private String joined;

    @JsonProperty("level")
    private Integer level;

    @JsonProperty("rank")
    private Integer rank;

    @JsonProperty("score")
    private Integer score;

    @JsonProperty("solved_challenges")
    private List<SolvedChallenge> solvedChallenges;

    @JsonProperty("user_count")
    private Integer userCount;

    @JsonProperty("username")
    private String username;

    @JsonProperty("website")
    private String website;

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class SolvedChallenge {
        @JsonProperty("category")
        private String category;

        @JsonProperty("date")
        private String date;

        @JsonProperty("name")
        private String name;

        @JsonProperty("points")
        private Integer points;

        @JsonProperty("solves")
        private Integer solves;
    }
}