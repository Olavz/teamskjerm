package app.teamskjerm.inforskjerm.conf

import com.google.cloud.Timestamp
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import tools.jackson.core.JsonGenerator
import tools.jackson.core.JsonParser
import tools.jackson.databind.DeserializationContext
import tools.jackson.databind.SerializationContext
import tools.jackson.databind.ValueDeserializer
import tools.jackson.databind.ValueSerializer
import tools.jackson.databind.module.SimpleModule
import java.time.Instant

@Configuration
class ObjectMapperConfig {

    @Bean
    fun customJacksonModule(): SimpleModule =
        SimpleModule().apply {
            addSerializer(Timestamp::class.java, TimestampValueSerializer())
            addDeserializer(Timestamp::class.java, TimestampValueDeserializer())
        }
}

class TimestampValueDeserializer : ValueDeserializer<Timestamp>() {
    override fun deserialize(p: JsonParser, ctxt: DeserializationContext): Timestamp {
        val instant = Instant.parse(p.text) // ISO-8601
        return Timestamp.ofTimeSecondsAndNanos(instant.epochSecond, instant.nano)
    }
}

class TimestampValueSerializer : ValueSerializer<Timestamp>() {
    override fun serialize(value: Timestamp, gen: JsonGenerator, ctxt: SerializationContext) {
        gen.writeString(value.toDate().toInstant().toString()) // ISO-8601
    }
}