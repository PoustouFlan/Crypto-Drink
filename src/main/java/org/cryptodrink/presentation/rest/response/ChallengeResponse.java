package org.cryptodrink.presentation.rest.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@AllArgsConstructor
public class ChallengeResponse {
    @JsonProperty("category")
    private String category;

    @JsonProperty("name")
    private String name;

    @JsonProperty("points")
    private Integer points;

    @JsonProperty("solves")
    private Integer solves;

    @JsonProperty("known_flaggers")
    private List<SolvedUserResponse> solvedUsers = new ArrayList<>();
}
