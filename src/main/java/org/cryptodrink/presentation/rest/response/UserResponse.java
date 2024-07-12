package org.cryptodrink.presentation.rest.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@AllArgsConstructor
public class UserResponse {
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
    private List<SolvedChallengeResponse> solvedChallenges;

    @JsonProperty("username")
    private String username;

    @JsonProperty("website")
    private String website;
}