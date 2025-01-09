package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

class OppdaterbarTekstKomponent(
    override val id: String,
    override val navn: String,
    override var data: String
) : KontrollpanelKomponent {
    override fun komponentNavn(): String {
        return "OppdaterbarTekstKomponent"
    }
}