package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.repository.KomponentPort
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import tools.jackson.databind.JsonNode
import kotlin.reflect.full.memberProperties
import kotlin.reflect.jvm.javaField


@RestController
@RequestMapping("/api")
class KomponentController(
    val komponentRepository: KomponentPort
) {

    data class KomponenttDataResponse(
        val data: String
    )

    @GetMapping("/komponent/{komponentId}/data")
    fun hentKomponentData(
        @PathVariable("komponentId") komponentId: String
    ): ResponseEntity<KomponenttDataResponse> {

        return ResponseEntity.ok(
            KomponenttDataResponse(
                komponentRepository.hentKomponentMedKomponentUUID(komponentId)
                    ?.data ?: throw UnsupportedOperationException("ladida fant ikke noen komponent..")
            )
        )
    }

    @GetMapping("/komponent/{komponentId}/data/schema")
    fun hentJsonSkjema(
        @PathVariable("komponentId") komponentId: String
    ): ResponseEntity<String> {
        return ResponseEntity.ok(
            komponentRepository.hentKomponentMedKomponentUUID(komponentId)
                ?.jsonSkjema() ?: throw UnsupportedOperationException("ladida fant ikke noen komponent..")
        )
    }

    @PutMapping("/komponent/{komponentUUID}")
    fun oppdaterKomponent(
        @PathVariable("komponentUUID") komponentUUID: String,
        @RequestBody payload: JsonNode
    ): ResponseEntity<KomponenttDataResponse> {
        val komponent = komponentRepository.hentKomponentMedKomponentUUID(komponentUUID)
            ?: throw UnsupportedOperationException("ladida fant ikke")

        oppdaterKomponentMedNiftyReflectionVirkerLurtHerOgNå(payload, komponent)

        komponentRepository.lagre(komponent)

        return ResponseEntity.ok(
            KomponenttDataResponse(
                "OK"
            )
        )
    }

    fun oppdaterKomponentMedNiftyReflectionVirkerLurtHerOgNå(
        jsonNode: JsonNode,
        component: KontrollpanelKomponent
    ): KontrollpanelKomponent {

        val properties = component::class.memberProperties.associateBy { it.name }

        for ((key, value) in jsonNode.properties()) {
            properties[key]?.javaField?.let { field ->
                field.isAccessible = true
                val targetType = field.type

                val convertedValue: Any? = when (targetType) {
                    Int::class.java, java.lang.Integer::class.java -> value.asInt()
                    Long::class.java, java.lang.Long::class.java -> value.asLong()
                    Double::class.java, java.lang.Double::class.java -> value.asDouble()
                    Float::class.java, java.lang.Float::class.java -> value.floatValue()
                    Number::class.java, java.lang.Number::class.java -> value.numberValue()
                    Boolean::class.java, java.lang.Boolean::class.java -> value.asBoolean()
                    String::class.java -> if (value.isNull) null else value.asText()
                    else -> if (value.isNull) null else value.asText()
                }

                field.set(component, convertedValue)
            }
        }
        return component
    }

}