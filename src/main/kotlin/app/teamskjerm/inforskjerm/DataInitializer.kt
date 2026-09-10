package app.teamskjerm.inforskjerm

import app.teamskjerm.inforskjerm.kontrollpanel.Kontrollpanel
import app.teamskjerm.inforskjerm.kontrollpanel.KomponentPlassering
import app.teamskjerm.inforskjerm.kontrollpanel.KomponentRekkefølge
import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.TekstKomponent
import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.VarselKomponent
import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.repository.KomponentPort
import app.teamskjerm.inforskjerm.kontrollpanel.repository.KontrollpanelPort
import app.teamskjerm.inforskjerm.sikkerhet.Bruker
import app.teamskjerm.inforskjerm.sikkerhet.repository.BrukerPort
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.context.annotation.Profile
import org.springframework.security.crypto.factory.PasswordEncoderFactories
import org.springframework.stereotype.Component
import tools.jackson.databind.json.JsonMapper
import java.util.UUID

@Profile("dev")
@Component
class DataInitializer(
    private val brukerPort: BrukerPort,
    private val kontrollpanelPort: KontrollpanelPort,
    private val komponentPort: KomponentPort,
    private val jsonMapper: JsonMapper
) : ApplicationRunner {

    override fun run(args: ApplicationArguments) {
        if (brukerPort.hentBruker("admin") != null) return

        val encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder()
        val bruker = brukerPort.lagre(Bruker(
            navn = "admin",
            passord = encoder.encode("admin") ?: ""
        ))

        val tekstKomponent = TekstKomponent().apply {
            komponentUUID = UUID.randomUUID().toString()
            navn = "Velkomstmelding"
            data = """{"tekst": "Velkommen til Teamskjerm!"}"""
        }
        val lagretTekst = komponentPort.lagre(tekstKomponent)

        val varselKomponent = VarselKomponent().apply {
            komponentUUID = UUID.randomUUID().toString()
            navn = "Systemstatus"
            data = """{"varseltype": "grønt", "tekst": "Alle systemer operative"}"""
        }
        val lagretVarsel = komponentPort.lagre(varselKomponent)

        val plassering = KomponentPlassering(
            venstre = listOf(KomponentRekkefølge(lagretTekst.komponentUUID, 0)),
            midten = listOf(KomponentRekkefølge(lagretVarsel.komponentUUID, 0))
        )

        kontrollpanelPort.lagre(Kontrollpanel(
            kontrollpanelUUID = UUID.randomUUID().toString(),
            navn = "Testskjerm",
            eierId = bruker.brukerUUID,
            komponenter = listOf(lagretTekst.komponentUUID, lagretVarsel.komponentUUID),
            komponentPlassering = jsonMapper.writeValueAsString(plassering)
        ))
    }
}
