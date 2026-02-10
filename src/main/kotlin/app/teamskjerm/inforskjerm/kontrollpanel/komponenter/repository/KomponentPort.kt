package app.teamskjerm.inforskjerm.kontrollpanel.komponenter.repository

import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.KontrollpanelKomponent

interface KomponentPort {
    fun hentKomponentMedKomponentUUID(komponentUUID: String): KontrollpanelKomponent?
    fun hentKomponenterMedId(komponenter: List<String>): List<KontrollpanelKomponent>?
    fun hentKomponenterMedIdUtenSecret(komponenter: List<String>): List<KontrollpanelKomponent>?

    fun lagre(kontrollpanelKomponent: KontrollpanelKomponent): KontrollpanelKomponent
    fun slett(komponentUUID: String): String
}