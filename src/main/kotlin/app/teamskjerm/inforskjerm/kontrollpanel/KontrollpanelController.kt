package app.teamskjerm.inforskjerm.kontrollpanel

import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.KomponentRepository
import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.KontrollpanelKomponent
import app.teamskjerm.inforskjerm.sikkerhet.TeamskjermUserDetails
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.http.ResponseEntity
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class KontrollpanelController(
    val kontrollpanelRepository: KontrollpanelRepository,
    val komponentRepository: KomponentRepository,
    val simpMessagingTemplate: SimpMessagingTemplate,
    private val objectMapper: ObjectMapper
) {

    @GetMapping("/kontrollpanel")
    fun kontrollpanel(
        @AuthenticationPrincipal bruker: TeamskjermUserDetails
    ): ResponseEntity<List<Kontrollpanel>> {
        return ResponseEntity.ok(kontrollpanelRepository.kontrollpanelForBruker(bruker.id()))
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

    @GetMapping("/kontrollpanel/{kontrollpanelUUID}/komponentPlassering")
    fun kontrollpanelKomponentPlassering(
        @PathVariable kontrollpanelUUID: String
    ): ResponseEntity<String> {
        return ResponseEntity.ok(
            kontrollpanelRepository.finnKontrollpanel(kontrollpanelUUID).komponentPlassering
        )
    }

    @GetMapping("/kontrollpanel/{kontrollpanelUUID}/komponenterUtenPlassering")
    fun komponenterUtenPlassering(
        @PathVariable kontrollpanelUUID: String
    ): ResponseEntity<List<String>> {
        val kontrollpanel = kontrollpanelRepository.finnKontrollpanel(kontrollpanelUUID)

        if (kontrollpanel.komponentPlassering.isEmpty()) {
            val alleKomponenter = komponentRepository.finnKomponenterMedId(kontrollpanel.komponenter)
            return ResponseEntity.ok(alleKomponenter?.map { it.komponentUUID } ?: emptyList())
        }

        val (venstre, midten, høyre) = objectMapper.readValue(
            kontrollpanel.komponentPlassering,
            KomponentPlassering::class.java
        )

        listOf(venstre, midten, høyre)
            .flatten()
            .map { it.komponentUUID }
            .let { plassertKomponenter ->
                komponentRepository.finnKomponenterMedId(kontrollpanel.komponenter)?.filterNot { plassertKomponenter.contains(it.komponentUUID) }
            }
            ?.map { it.komponentUUID }
            .let {
                return ResponseEntity.ok(it)
            }
    }

    @PostMapping("/kontrollpanel/{kontrollpanelUUID}/komponentPlassering")
    fun oppdaterKontrollpanelKomponentPlassering(
        @PathVariable kontrollpanelUUID: String,
        @RequestBody kontrollpanelKomponentPlassering: String
    ): ResponseEntity<String> {
        val kontrollpanel = kontrollpanelRepository.finnKontrollpanel(kontrollpanelUUID)
        kontrollpanel.komponentPlassering = kontrollpanelKomponentPlassering
        kontrollpanelRepository.lagre(kontrollpanel)

        simpMessagingTemplate.convertAndSend("/kontrollpanel/${kontrollpanelUUID}", """
            {
              "oppdater": true
            }
        """.trimIndent())
        return ResponseEntity.ok(
            ""
        )
    }

    @PostMapping("/kontrollpanel")
    fun opprettKontrollpanel(
        @AuthenticationPrincipal bruker: TeamskjermUserDetails,
        @RequestBody komponent: JsonNode
    ): ResponseEntity<Kontrollpanel> {

        val nyttKontrollpanel = objectMapper.convertValue(komponent, Kontrollpanel::class.java)

        nyttKontrollpanel.eierId = bruker.id()
        nyttKontrollpanel.komponentPlassering = """
            {
              "venstre": [],
              "midten": [],
              "høyre": []
            }
        """.trimIndent()

        val lagretKomponent = kontrollpanelRepository.lagre(
            nyttKontrollpanel
        )

        return ResponseEntity.ok(
            lagretKomponent
        )
    }

    @PostMapping("/kontrollpanel/{kontrollpanelUUID}/komponent")
    fun opprettKomponent(
        @PathVariable kontrollpanelUUID: String,
        @RequestBody komponent: JsonNode
    ): ResponseEntity<String> {

        val typetKomponent = objectMapper.convertValue(komponent, KontrollpanelKomponent::class.java)

        val lagretKomponent = komponentRepository.lagre(
            typetKomponent
        )

        val kontrollpanel = kontrollpanelRepository.finnKontrollpanel(kontrollpanelUUID)
        val nyListe = mutableListOf<String>()
        nyListe.addAll(kontrollpanel.komponenter)
        nyListe.add(lagretKomponent.id)

        kontrollpanel.komponenter = nyListe

        kontrollpanelRepository.lagre(kontrollpanel)

        return ResponseEntity.ok(
            ""
        )
    }

    @DeleteMapping("/kontrollpanel/{kontrollpanelUUID}/komponent/{komponentUUID}")
    fun slettKomponent(
        @PathVariable kontrollpanelUUID: String,
        @PathVariable komponentUUID: String
    ): ResponseEntity<String> {

        val slettetKomponentId = komponentRepository.slettKomponentMed(komponentUUID)

        val kontrollpanel = kontrollpanelRepository.finnKontrollpanel(kontrollpanelUUID)
        val oppdatertKomponenter = mutableListOf<String>()
        oppdatertKomponenter.addAll(kontrollpanel.komponenter)
        oppdatertKomponenter.remove(slettetKomponentId)

        kontrollpanel.komponenter = oppdatertKomponenter

        val komponentPlassering =
            objectMapper.readValue(kontrollpanel.komponentPlassering, KomponentPlassering::class.java)

        KomponentPlassering(
            venstre = komponentPlassering.venstre.filter { it.komponentUUID != komponentUUID },
            midten = komponentPlassering.midten.filter { it.komponentUUID != komponentUUID },
            høyre = komponentPlassering.høyre.filter { it.komponentUUID != komponentUUID }
        ).let {
            kontrollpanel.komponentPlassering = objectMapper.writeValueAsString(it)
        }

        kontrollpanelRepository.lagre(kontrollpanel)

        return ResponseEntity.ok(
            ""
        )
    }

}