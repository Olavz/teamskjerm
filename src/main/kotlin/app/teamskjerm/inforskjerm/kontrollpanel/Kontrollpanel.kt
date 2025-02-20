package app.teamskjerm.inforskjerm.kontrollpanel

data class Kontrollpanel(
    var id: String = "", // Settes og genereres av firestore
    val kontrollpanelUUID: String = "",
    var navn: String = "",
    var eierId: String = "",
    var komponenter: List<String> = mutableListOf<String>()
)