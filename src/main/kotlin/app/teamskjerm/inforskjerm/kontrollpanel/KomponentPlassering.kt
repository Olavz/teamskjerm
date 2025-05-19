package app.teamskjerm.inforskjerm.kontrollpanel

data class KomponentPlassering(
    var venstre: List<KomponentRekkefølge> = mutableListOf(),
    var midten: List<KomponentRekkefølge> = mutableListOf(),
    var høyre: List<KomponentRekkefølge> = mutableListOf()

)