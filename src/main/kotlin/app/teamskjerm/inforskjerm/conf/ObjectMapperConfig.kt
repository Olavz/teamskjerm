package app.teamskjerm.inforskjerm.conf

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonDeserializer
import com.fasterxml.jackson.databind.JsonSerializer
import com.fasterxml.jackson.databind.SerializerProvider
import com.fasterxml.jackson.databind.module.SimpleModule
import com.google.cloud.Timestamp
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.Instant

@Configuration
class ObjectMapperConfig {

    @Bean
    fun customJacksonModule(): SimpleModule {
        return SimpleModule().apply {
            addSerializer(Timestamp::class.java, TimestampSerializer())
            addDeserializer(Timestamp::class.java, TimestampDeserializer())
        }
    }

}

class TimestampDeserializer : JsonDeserializer<Timestamp>() {
    override fun deserialize(p: JsonParser, ctxt: DeserializationContext): Timestamp {
        val instant = Instant.parse(p.text) // Parse ISO 8601
        return Timestamp.ofTimeSecondsAndNanos(instant.epochSecond, instant.nano) // Lag Timestamp
    }
}

class TimestampSerializer : JsonSerializer<Timestamp>() {
    override fun serialize(value: Timestamp, gen: JsonGenerator, serializers: SerializerProvider) {
        gen.writeString(value.toDate().toInstant().toString()) // ISO 8601
    }
}