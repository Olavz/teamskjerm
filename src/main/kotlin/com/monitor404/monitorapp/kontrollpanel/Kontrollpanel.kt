package com.monitor404.monitorapp.kontrollpanel

import com.monitor404.monitorapp.kontrollpanel.komponenter.KontrollpanelKomponent

data class Kontrollpanel(
    val id: String,
    val navn: String,
    val komponenter: List<KontrollpanelKomponent>
)