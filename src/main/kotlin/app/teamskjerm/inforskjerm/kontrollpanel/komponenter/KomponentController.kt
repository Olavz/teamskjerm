package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

import com.fasterxml.jackson.databind.JsonNode
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import kotlin.reflect.full.memberProperties
import kotlin.reflect.jvm.javaField


@RestController
@RequestMapping("/api")
class KomponentController(
    val komponentRepository: KomponentRepository
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
                komponentRepository.finnKomponentMedKomponentUUID(komponentId)
                    ?.data ?: throw UnsupportedOperationException("ladida fant ikke noen komponent..")
            )
        )
    }

    @GetMapping("/komponent/{komponentId}/data/schema")
    fun hentJsonSkjema(
        @PathVariable("komponentId") komponentId: String
    ): ResponseEntity<String> {
        return ResponseEntity.ok(
            komponentRepository.finnKomponentMedKomponentUUID(komponentId)
                ?.jsonSkjema() ?: throw UnsupportedOperationException("ladida fant ikke noen komponent..")
        )
    }

    @PutMapping("/komponent/{komponentUUID}")
    fun oppdaterKomponent(
        @PathVariable("komponentUUID") komponentUUID: String,
        @RequestBody payload: JsonNode
    ): ResponseEntity<KomponenttDataResponse> {
        val komponent = komponentRepository.finnKomponentMedKomponentUUID(komponentUUID)
            ?: throw UnsupportedOperationException("ladida fant ikke")

        oppdaterKomponentMedNiftyReflectionVirkerLurtHerOgNå(payload, komponent)

        komponentRepository.lagre(komponent)

        return ResponseEntity.ok(
            KomponenttDataResponse(
                "OK"
            )
        )
    }

    fun oppdaterKomponentMedNiftyReflectionVirkerLurtHerOgNå(jsonNode: JsonNode, component: KontrollpanelKomponent): KontrollpanelKomponent {
        val properties = component::class.memberProperties.associateBy { it.name }

        jsonNode.fields().forEach { (key, value) ->
            properties[key]?.javaField?.let { field ->
                field.isAccessible = true
                println("Updating field: $key with value: ${value.asText()}") // Feilsøk her
                field.set(component, value.asText())
            }
        }
        return component
    }

}