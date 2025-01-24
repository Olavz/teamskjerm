package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

import app.teamskjerm.inforskjerm.sikkerhet.KomponentSecretHashkeyService
import com.fasterxml.jackson.databind.JsonNode
import com.google.cloud.Timestamp
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Instant
import java.time.LocalDateTime


@RestController
@RequestMapping("/api/ext")
class EksternKomponentController(
    val simpMessagingTemplate: SimpMessagingTemplate,
    val komponentRepository: KomponentRepository,
    val komponentSecretHashkeyService: KomponentSecretHashkeyService
) {

    data class KomponenttDataResponse(
        val data: String
    )

    @PutMapping("/komponent/{komponentUUID}/{secret}/{hashkey}")
    fun oppdaterKomponentData(
        @PathVariable("komponentUUID") komponentUUID: String,
        @PathVariable("secret") secret: String,
        @PathVariable("hashkey") hashkey: String,
        @RequestBody payload: JsonNode
    ): ResponseEntity<KomponenttDataResponse> {

        if (!komponentSecretHashkeyService.hashkey(komponentUUID, secret).equals(hashkey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(KomponenttDataResponse("https://www.youtube.com/watch?v=nfqEcG7EZMo"))
        }

        val komponent = komponentRepository.finnKomponentMedKomponentUUID(komponentUUID)

        if (komponent == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(KomponenttDataResponse("Fant ikke komponent"))
        }

        if (!komponent.secret.equals(secret)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(KomponenttDataResponse("Ugyldig nøkkel"))
        }

        simpMessagingTemplate.convertAndSend("/komponent/${komponentUUID}", payload)

        val validerSkjema = komponent.validerSkjema(payload.toString())
        if (!validerSkjema.harFeil) {
            komponent.data = payload.toString()
            komponent.sistOppdatert = nå()
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

    fun nå(): Timestamp {
        val date: LocalDateTime = LocalDateTime.now()
        val instant: Instant = date.atOffset(java.time.ZoneOffset.UTC).toInstant()
        return Timestamp.ofTimeSecondsAndNanos(instant.epochSecond, instant.nano)
    }
}