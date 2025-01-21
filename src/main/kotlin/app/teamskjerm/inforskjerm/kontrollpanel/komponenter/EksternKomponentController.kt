package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

import com.fasterxml.jackson.databind.JsonNode
import org.springframework.http.ResponseEntity
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api/ext")
class EksternKomponentController(
    val simpMessagingTemplate: SimpMessagingTemplate,
    val komponentRepository: KomponentRepository
) {

    data class KomponenttDataResponse(
        val data: String
    )

    @PutMapping("/komponent/{komponentUUID}/data")
    fun oppdaterKomponentData(
        @PathVariable("komponentUUID") komponentUUID: String,
        @RequestBody payload: JsonNode
    ): ResponseEntity<KomponenttDataResponse> {
        simpMessagingTemplate.convertAndSend("/komponent/${komponentUUID}", payload)
        val komponent = komponentRepository.finnKomponentMedKomponentUUID(komponentUUID)
            ?: throw UnsupportedOperationException("ladida fant ikke")

        val validerSkjema = komponent.validerSkjema(payload.toString())
        if (!validerSkjema.harFeil) {
            komponent.data = payload.toString()
            komponentRepository.lagre(komponent)
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

}