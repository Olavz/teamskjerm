package app.teamskjerm.inforskjerm.kontrollpanel

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
    val kontrollpanelRepository: KontrollpanelRepository
) {

    data class KomponenttDataResponse(
        val data: String
    )

    val map: MutableMap<String, String> = mutableMapOf()

    @PutMapping("/kontrollpanel/{kontrollpanelId}/komponent/{komponentId}/data")
    fun oppdaterKomponent(
        @PathVariable("kontrollpanelId") kontrollpanelId: String,
        @PathVariable("komponentId") komponentId: String,
        @RequestBody payload: JsonNode
    ): ResponseEntity<KomponenttDataResponse> {
        simpMessagingTemplate.convertAndSend("/kontrollpanel/${kontrollpanelId}/komponent/${komponentId}", payload)
        kontrollpanelRepository.alleKontrollpanel()
            .filter { it.id == kontrollpanelId }
            .single()
            .komponenter
            .filter { it.id == komponentId }
            .single()
            .data = payload.toString()
        return ResponseEntity.ok(
            KomponenttDataResponse(
                "OK"
            )
        )
    }

    @GetMapping("/kontrollpanel/{kontrollpanelId}/komponent/{komponentId}/data")
    fun hent(
        @PathVariable("kontrollpanelId") kontrollpanelId: String,
        @PathVariable("komponentId") komponentId: String
    ): ResponseEntity<KomponenttDataResponse> {

        return ResponseEntity.ok(
            KomponenttDataResponse(
                kontrollpanelRepository.alleKontrollpanel()
                    .filter { it.id.equals(kontrollpanelId) }
                    .single()
                    .komponenter
                    .filter { it.id.equals(komponentId) }
                    .single()
                    .data
            )
        )
    }

}