package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

import com.fasterxml.jackson.annotation.JsonProperty

interface KontrollpanelKomponent {
    val id: String
    val navn: String
    var data: String

    @JsonProperty(value = "komponentNavn", required = true)
    fun komponentNavn(): String
}