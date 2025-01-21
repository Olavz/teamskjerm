package app.teamskjerm.inforskjerm.kontrollpanel

import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.KomponentRepository
import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.KontrollpanelKomponent
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api/ext")
class EksterntKontrollpanelController(
    val kontrollpanelRepository: KontrollpanelRepository,
    val komponentRepository: KomponentRepository,
    private val objectMapper: ObjectMapper
) {


    @GetMapping("/kontrollpanel/{kontrollpanelUUID}/komponenter")
    fun kontrollpanelSineKomponenter(
        @PathVariable kontrollpanelUUID: String
    ): ResponseEntity<List<KontrollpanelKomponent>> {
        return ResponseEntity.ok(
            komponentRepository.finnKomponenterMedIdUtenSecret(
                kontrollpanelRepository.finnKontrollpanel(kontrollpanelUUID)
                    .komponenter
            )
        )
    }
}