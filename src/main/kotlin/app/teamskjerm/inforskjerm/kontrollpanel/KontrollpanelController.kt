package app.teamskjerm.inforskjerm.kontrollpanel

import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.KontrollpanelKomponent
import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.repository.KomponentPort
import app.teamskjerm.inforskjerm.kontrollpanel.repository.KontrollpanelPort
import app.teamskjerm.inforskjerm.sikkerhet.TeamskjermUserDetails
import org.springframework.http.ResponseEntity
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import tools.jackson.databind.JsonNode
import tools.jackson.databind.json.JsonMapper

@RestController
@RequestMapping("/api")
class KontrollpanelController(
    val kontrollpanelRepository: KontrollpanelPort,
    val komponentRepository: KomponentPort,
    val simpMessagingTemplate: SimpMessagingTemplate,
    val jsonMapper: JsonMapper
) {

    @GetMapping("/kontrollpanel")
    fun kontrollpanel(
        @AuthenticationPrincipal bruker: TeamskjermUserDetails
    ): ResponseEntity<List<Kontrollpanel>> {
        return ResponseEntity.ok(kontrollpanelRepository.hentKontrollpanelForBruker(bruker.id()))
    }


    @GetMapping("/kontrollpanel/{kontrollpanelUUID}/komponenter")
    fun kontrollpanelSineKomponenter(
        @PathVariable kontrollpanelUUID: String
    ): ResponseEntity<List<KontrollpanelKomponent>> {
        return ResponseEntity.ok(
            komponentRepository.hentKomponenterMedId(
                kontrollpanelRepository.hentKontrollpanel(kontrollpanelUUID)
                    .komponenter
            )
        )
    }

    @GetMapping("/kontrollpanel/{kontrollpanelUUID}/komponentPlassering")
    fun kontrollpanelKomponentPlassering(
        @PathVariable kontrollpanelUUID: String
    ): ResponseEntity<String> {
        return ResponseEntity.ok(
            kontrollpanelRepository.hentKontrollpanel(kontrollpanelUUID).komponentPlassering
        )
    }

    @GetMapping("/kontrollpanel/{kontrollpanelUUID}/komponenterUtenPlassering")
    fun komponenterUtenPlassering(
        @PathVariable kontrollpanelUUID: String
    ): ResponseEntity<List<String>> {
        val kontrollpanel = kontrollpanelRepository.hentKontrollpanel(kontrollpanelUUID)

        if (kontrollpanel.komponentPlassering.isEmpty()) {
            val alleKomponenter = komponentRepository.hentKomponenterMedId(kontrollpanel.komponenter)
            return ResponseEntity.ok(alleKomponenter?.map { it.komponentUUID } ?: emptyList())
        }

        val (venstre, midten, høyre) = jsonMapper.readValue(
            kontrollpanel.komponentPlassering,
            KomponentPlassering::class.java
        )

        listOf(venstre, midten, høyre)
            .flatten()
            .map { it.komponentUUID }
            .let { plassertKomponenter ->
                komponentRepository.hentKomponenterMedId(kontrollpanel.komponenter)
                    ?.filterNot { plassertKomponenter.contains(it.komponentUUID) }
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
        val kontrollpanel = kontrollpanelRepository.hentKontrollpanel(kontrollpanelUUID)
        kontrollpanel.komponentPlassering = kontrollpanelKomponentPlassering
        kontrollpanelRepository.lagre(kontrollpanel)

        simpMessagingTemplate.convertAndSend(
            "/kontrollpanel/${kontrollpanelUUID}", """
            {
              "oppdater": true
            }
        """.trimIndent()
        )
        return ResponseEntity.ok(
            ""
        )
    }

    @PostMapping("/kontrollpanel")
    fun opprettKontrollpanel(
        @AuthenticationPrincipal bruker: TeamskjermUserDetails,
        @RequestBody komponent: JsonNode
    ): ResponseEntity<Kontrollpanel> {

        val nyttKontrollpanel = jsonMapper.convertValue(komponent, Kontrollpanel::class.java)

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

        val typetKomponent = jsonMapper.convertValue(komponent, KontrollpanelKomponent::class.java)

        val lagretKomponent = komponentRepository.lagre(
            typetKomponent
        )

        val kontrollpanel = kontrollpanelRepository.hentKontrollpanel(kontrollpanelUUID)
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

        val slettetKomponentId = komponentRepository.slett(komponentUUID)

        val kontrollpanel = kontrollpanelRepository.hentKontrollpanel(kontrollpanelUUID)
        val oppdatertKomponenter = mutableListOf<String>()
        oppdatertKomponenter.addAll(kontrollpanel.komponenter)
        oppdatertKomponenter.remove(slettetKomponentId)

        kontrollpanel.komponenter = oppdatertKomponenter

        val komponentPlassering =
            jsonMapper.readValue(kontrollpanel.komponentPlassering, KomponentPlassering::class.java)

        KomponentPlassering(
            venstre = komponentPlassering.venstre.filter { it.komponentUUID != komponentUUID },
            midten = komponentPlassering.midten.filter { it.komponentUUID != komponentUUID },
            høyre = komponentPlassering.høyre.filter { it.komponentUUID != komponentUUID }
        ).let {
            kontrollpanel.komponentPlassering = jsonMapper.writeValueAsString(it)
        }

        kontrollpanelRepository.lagre(kontrollpanel)

        return ResponseEntity.ok(
            ""
        )
    }

}