package org.cryptodrink.utils;

import java.time.*;
import java.time.format.DateTimeFormatter;

public class TimeString {
    public static String convertToUTCString(LocalDateTime localDateTime) {
        if (localDateTime == null) {
            return null;
        }
        ZonedDateTime zonedDateTime = localDateTime.atZone(ZoneOffset.UTC);
        DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT;
        return zonedDateTime.format(formatter);
    }

    public static String convertToUTCString(Instant instant) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");
        return formatter.withZone(ZoneId.of("UTC")).format(instant);
    }
}
