package app.teamskjerm.inforskjerm.kontrollpanel.repository

import app.teamskjerm.inforskjerm.kontrollpanel.Kontrollpanel

interface KontrollpanelPort {

    fun hentKontrollpanelForBruker(brukerId: String): List<Kontrollpanel>

    fun hentKontrollpanel(kontrollpanelId: String): Kontrollpanel

    fun lagre(kontrollpanel: Kontrollpanel): Kontrollpanel

    fun slett(kontrollpanelUUID: String): Boolean
}