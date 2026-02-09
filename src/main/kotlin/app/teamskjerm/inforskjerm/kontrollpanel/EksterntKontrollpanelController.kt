package app.teamskjerm.inforskjerm.kontrollpanel

import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.KomponentRepository
import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.KontrollpanelKomponent
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import tools.jackson.databind.json.JsonMapper


@RestController
@RequestMapping("/api/ext")
class EksterntKontrollpanelController(
    val kontrollpanelRepository: KontrollpanelRepository,
    val komponentRepository: KomponentRepository,
    val jsonMapper: JsonMapper
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

    @GetMapping("/kontrollpanel/{kontrollpanelUUID}/komponentPlassering")
    fun kontrollpanelKomponentPlassering(
        @PathVariable kontrollpanelUUID: String
    ): ResponseEntity<KomponentPlassering> {
        return ResponseEntity.ok(
            jsonMapper.readValue(
                kontrollpanelRepository.finnKontrollpanel(kontrollpanelUUID).komponentPlassering,
                KomponentPlassering::class.java
            )
        )
    }
}