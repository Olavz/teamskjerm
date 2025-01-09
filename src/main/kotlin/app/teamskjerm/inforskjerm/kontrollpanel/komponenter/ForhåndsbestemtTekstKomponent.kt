package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

class ForhåndsbestemtTekstKomponent(
    override val id: String,
    override val navn: String,
    override var data: String
) : KontrollpanelKomponent {

    override fun komponentNavn(): String {
        return "ForhaandsbestemtTekstKomponent"
    }

}