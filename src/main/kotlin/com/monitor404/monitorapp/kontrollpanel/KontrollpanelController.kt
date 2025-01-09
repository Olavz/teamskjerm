package com.monitor404.monitorapp.kontrollpanel

import com.monitor404.monitorapp.kontrollpanel.komponenter.KontrollpanelKomponent
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class KontrollpanelController(
    val kontrollpanelRepository: KontrollpanelRepository
) {

    @GetMapping("/kontrollpanel")
    fun kontrollpanel(): ResponseEntity<List<Kontrollpanel>> {
        return ResponseEntity.ok(kontrollpanelRepository.alleKontrollpanel())
    }

    @GetMapping("/kontrollpanel/{id}/komponenter")
    fun kontrollpanelSineKomponenter(
        @PathVariable id: String
    ): ResponseEntity<List<KontrollpanelKomponent>> {
        return ResponseEntity.ok(
            kontrollpanelRepository.alleKontrollpanel()
                .filter { it.id.equals(id)}
                .single()
                .komponenter
        )
    }

}