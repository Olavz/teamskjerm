package app.teamskjerm.inforskjerm.kontrollpanel

data class Kontrollpanel(
    val id: String = "", // Settes og genereres av firestore
    val kontrollpanelUUID: String = "",
    val navn: String = "",
    val komponenter: List<String> = emptyList()
)