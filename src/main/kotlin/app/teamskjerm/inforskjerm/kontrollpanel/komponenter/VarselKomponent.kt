package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

class VarselKomponent(
    override var id: String = "",
    override var komponentUUID:String = "",
    override var navn: String = "",
    override var data: String = "",
    override var komponentType: String = "VarselKomponent",
    override var seMerInformasjon: String = ""
) : KontrollpanelKomponent {

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