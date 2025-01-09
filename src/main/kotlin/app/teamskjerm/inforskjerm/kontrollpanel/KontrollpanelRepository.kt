package app.teamskjerm.inforskjerm.kontrollpanel

import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.AlertKomponent
import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.ForhåndsbestemtTekstKomponent
import org.springframework.stereotype.Repository

@Repository
class KontrollpanelRepository {

    private val kontrollpaneler = mutableListOf(
        Kontrollpanel(
            "01941ebb-4356-7bce-8489-c66ee4f77c13",
            "Test",
            mutableListOf(
                ForhåndsbestemtTekstKomponent(
                    "244e01ce-c0a2-4c61-af2b-c056a819a628",
                    "MOTD",
                    "Hello World!"
                ),
                ForhåndsbestemtTekstKomponent(
                    "244e01ce-c0a2-4c61-af2b-c056a819a629",
                    "MOTD2",
                    "Lorem" +
                            " ipsum dolor sit amet, consectetur adipiscing elit. Curabitur suscipit ultrices malesuada. Morbi et efficitur odio, a molestie lorem. Nunc erat lectus, ornare id tempus tristique, porta eget odio. Nullam ac rhoncus massa, elementum condimentum ligula. Cras id ex eget lectus congue convallis tincidunt nec nisl. Proin non facilisis mi. Vestibulum vestibulum, mi feugiat bibendum dignissim, enim mi mattis"
                ),
                app.teamskjerm.inforskjerm.kontrollpanel.komponenter.OppdaterbarTekstKomponent(
                    "4a629b34-027b-4a62-8e60-e025153e31c5",
                    "Temperatursensor garasjen",
                    "Første verdi"
                ),
                app.teamskjerm.inforskjerm.kontrollpanel.komponenter.OppdaterbarTekstKomponent(
                    "019437da-983e-79f6-ab69-ca9854f5f861",
                    "Strømforbruk panelovn",
                    "-"
                ),
                AlertKomponent(
                    "4a629b34-027b-4a62-8e60-e025153e31c6",
                    "Jenkins overvåking",
                    "false"
                )
            )
        )
    )

    fun alleKontrollpanel() = kontrollpaneler

}