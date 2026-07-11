package ec.edu.ups.icc.fundamentos01.security.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class JacksonConfig {

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();

        // Soporte para fechas de Java 8+ (como LocalDateTime en ErrorResponse)
        mapper.registerModule(new JavaTimeModule());

        // Formato ISO-8601 legible en lugar de números extensos
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        // Evita fallos si hay beans vacíos
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);

        return mapper;
    }
}
