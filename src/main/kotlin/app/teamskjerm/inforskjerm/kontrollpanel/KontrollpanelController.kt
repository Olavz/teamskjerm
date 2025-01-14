package app.teamskjerm.inforskjerm.kontrollpanel

import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.KomponentRepository
import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.KontrollpanelKomponent
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class KontrollpanelController(
    val kontrollpanelRepository: KontrollpanelRepository,
    val komponentRepository: KomponentRepository
) {

    @GetMapping("/kontrollpanel")
    fun kontrollpanel(): ResponseEntity<List<Kontrollpanel>> {
        return ResponseEntity.ok(kontrollpanelRepository.alleKontrollpanel())
    }

    @GetMapping("/nyttkontrollpanel")
    fun nyttkontrollpanel(): ResponseEntity<List<String>> {
        return ResponseEntity.ok(kontrollpanelRepository.nyttkontrollpanel())
    }

    @GetMapping("/kontrollpanel/{kontrollpanelUUID}/komponenter")
    fun kontrollpanelSineKomponenter(
        @PathVariable kontrollpanelUUID: String
    ): ResponseEntity<List<KontrollpanelKomponent>> {
        return ResponseEntity.ok(
            komponentRepository.finnKomponenterMedId(
                kontrollpanelRepository.finnKontrollpanel(kontrollpanelUUID)
                    .komponenter
            )
        )
    }

}