package org.cryptodrink.presentation.rest.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;

@JsonIgnoreProperties(ignoreUnknown = true)
@AllArgsConstructor
public class SolvedUserResponse {
    @JsonProperty("date")
    private String date;

    @JsonProperty("username")
    private String username;
}
