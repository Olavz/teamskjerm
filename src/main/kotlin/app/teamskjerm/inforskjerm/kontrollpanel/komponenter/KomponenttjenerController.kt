package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

import com.fasterxml.jackson.databind.JsonNode
import org.springframework.http.ResponseEntity
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api")
class KomponenttjenerController(
    val simpMessagingTemplate: SimpMessagingTemplate,
    val komponentRepository: KomponentRepository
) {

    data class KomponenttDataResponse(
        val data: String
    )

    val map: MutableMap<String, String> = mutableMapOf()

    @PutMapping("/komponent/{komponentUUID}/data")
    fun oppdaterKomponentData(
        @PathVariable("komponentUUID") komponentUUID: String,
        @RequestBody payload: JsonNode
    ): ResponseEntity<KomponenttDataResponse> {
        simpMessagingTemplate.convertAndSend("/komponent/${komponentUUID}", payload)
        val komponent = komponentRepository.finnKomponentMedKomponentUUID(komponentUUID) ?: throw UnsupportedOperationException("ladida fant ikke")

        val validerSkjema = komponent.validerSkjema(payload.toString())
        if (!validerSkjema.harFeil) {
            komponent.data = payload.toString()
            komponentRepository.lagreKomponent(komponent)
            return ResponseEntity.ok(
                KomponenttDataResponse(
                    "OK"
                )
            )
        }

        return ResponseEntity.badRequest().body(
            KomponenttDataResponse(
                "Validering feilet: " + validerSkjema.skjemafeil
            )
        )

    }

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

}