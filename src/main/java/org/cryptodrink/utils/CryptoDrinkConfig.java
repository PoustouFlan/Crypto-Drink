package org.cryptodrink.utils;

import org.eclipse.microprofile.config.inject.ConfigProperties;

@ConfigProperties(prefix = "cryptodrink")
public class CryptoDrinkConfig {
    public String frontendUrl;
}