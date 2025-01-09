package app.teamskjerm.inforskjerm.kontrollpanel

import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.AlertKomponent
import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.TekstKomponent
import org.springframework.stereotype.Repository

@Repository
class KontrollpanelRepository {

    private val kontrollpaneler = mutableListOf(
        Kontrollpanel(
            "01941ebb-4356-7bce-8489-c66ee4f77c13",
            "Test",
            mutableListOf(
                TekstKomponent(
                    "244e01ce-c0a2-4c61-af2b-c056a819a628",
                    "MOTD",
                    """{"melding": "hello world"}"""
                ),
                TekstKomponent(
                    "244e01ce-c0a2-4c61-af2b-c056a819a629",
                    "MOTD2",
                    """{"melding": "hello world"}"""
                ),
                TekstKomponent(
                    "4a629b34-027b-4a62-8e60-e025153e31c5",
                    "Temperatursensor garasjen",
                    """{"melding": "-"}"""
                ),
                TekstKomponent(
                    "019437da-983e-79f6-ab69-ca9854f5f861",
                    "Strømforbruk panelovn",
                    """{"melding": "-"}"""
                ),
                AlertKomponent(
                    "4a629b34-027b-4a62-8e60-e025153e31c6",
                    "Jenkins overvåking",
                    """{"harVarsel": false, "melding": ""}"""
                )
            )
        )
    )

    fun alleKontrollpanel() = kontrollpaneler

}