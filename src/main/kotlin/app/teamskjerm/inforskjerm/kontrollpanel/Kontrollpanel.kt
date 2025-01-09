package app.teamskjerm.inforskjerm.kontrollpanel

import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.KontrollpanelKomponent

data class Kontrollpanel(
    val id: String,
    val navn: String,
    val komponenter: List<KontrollpanelKomponent>
)