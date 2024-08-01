package org.cryptodrink.presentation.rest.request;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String payload;
}
