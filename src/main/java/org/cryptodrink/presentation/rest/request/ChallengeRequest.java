package org.cryptodrink.presentation.rest.request;

import lombok.Data;

@Data
public class ChallengeRequest {
    private String name;
    private String category;
}
