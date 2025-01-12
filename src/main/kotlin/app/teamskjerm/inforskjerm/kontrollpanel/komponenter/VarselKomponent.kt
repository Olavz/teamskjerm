package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

class VarselKomponent(
    override val id: String,
    override var navn: String,
    override var data: String
) : KontrollpanelKomponent {
    override fun komponentNavn(): String {
        return "VarselKomponent"
    }

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
                  "enum": ["grønnt", "gult", "rødt"]
                },
                "melding": {
                  "description": "Melding/tekst som skal formidles som varsel",
                  "type": "string"
                }
              },
              "required": ["varseltype", "melding"]
            }
        """.trimIndent()
    }
}