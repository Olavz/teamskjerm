package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

class TekstKomponent: KontrollpanelKomponent(
    komponentType = "TekstKomponent"
) {

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