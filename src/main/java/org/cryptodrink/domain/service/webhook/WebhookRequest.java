package org.cryptodrink.domain.service.webhook;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class WebhookRequest {
    private String content;
    private List<Embed> embeds;

    @Data
    public static class Embed {
        private String title;
        private String description;
        private List<Field> fields;
        private String timestamp;

        @Data
        public static class Field {
            private String name;
            private String value;
            private Boolean inline;
        }
    }
}
