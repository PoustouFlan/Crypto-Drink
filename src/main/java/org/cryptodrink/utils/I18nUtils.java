package org.cryptodrink.utils;

public class I18nUtils {
    public static String toOrdinal(Long n)
    {
        // French
        if (n == 1)
            return "1ᵉʳ";
        else
            return n + "ᵉ";
    }
}
