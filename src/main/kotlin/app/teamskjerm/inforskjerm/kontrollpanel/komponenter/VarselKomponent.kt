package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

class VarselKomponent(
    var skjulVarselEtterMinutterUtenFeil: Int? = null,
) : KontrollpanelKomponent(
    komponentType = "VarselKomponent"
) {

    override fun jsonSkjema(): String {
        return """
            {
              "${'$'}schema": "http://json-schema.org/draft-07/schema",
              "${'$'}id": "https://todo/VarselKomponent.json",
              "title": "VarselKomponent",
              "description": "",
              "type": "object",
              "properties": {
                "varseltype": {
                  "description": "Varseltype ala trafikklys.",
                  "type": "string",
                  "enum": ["grønt", "gult", "rødt"]
                },
                "tekst": {
                  "description": "Tekst som skal formidles som varsel",
                  "type": "string"
                }
              },
              "required": ["varseltype", "tekst"]
            }
        """.trimIndent()
    }
}