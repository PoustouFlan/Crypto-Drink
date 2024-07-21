package org.cryptodrink.presentation.rest.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;

@JsonIgnoreProperties(ignoreUnknown = true)
@AllArgsConstructor
public class CategoryCompletionResponse {
    @JsonProperty("name")
    private String name;

    @JsonProperty("solved")
    private Integer solved;

    @JsonProperty("total")
    private Integer total;

    @JsonProperty("score")
    private Integer score;

    @JsonProperty("total_score")
    private Integer totalScore;
}