package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

class TekstKomponent(
    override var id: String = "",
    override var komponentUUID:String = "",
    override var navn: String = "",
    override var data: String = "",
    override var komponentType: String = "TekstKomponent",
    override var seMerInformasjon: String = ""
) : KontrollpanelKomponent {

    override fun jsonSkjema(): String {
        return """
            {
              "${'$'}schema": "http://json-schema.org/draft-07/schema",
              "${'$'}id": "https://todo/TekstKomponent.json",
              "title": "Tekstkomponent",
              "description": "",
              "type": "object",
              "properties": {
                "tekst": {
                  "description": "Tekst som skal formidles til komponentet",
                  "type": "string"
                }
              },
              "required": ["tekst"]
            }
        """.trimIndent()
    }

}