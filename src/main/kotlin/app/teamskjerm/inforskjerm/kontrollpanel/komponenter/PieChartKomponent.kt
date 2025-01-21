package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

class PieChartKomponent(
    override var id: String = "",
    override var komponentUUID: String = "",
    override var navn: String = "",
    override var data: String = "",
    override var komponentType: String = "PieChartKomponent",
    override var seMerInformasjon: String = ""
) : KontrollpanelKomponent {

    override fun jsonSkjema(): String {
        return """
            {
              "${'$'}schema": "http://json-schema.org/draft-07/schema",
              "${'$'}id": "https://todo/PieChartKomponent.json",
              "title": "PieChartKomponent",
              "description": "",
              "type": "object",
              "properties": {
                "data": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "value": {
                        "type": "number"
                      },
                      "name": {
                        "type": "string"
                      }
                    },
                    "required": [
                      "value",
                      "name"
                    ],
                    "additionalProperties": false
                  }
                }
              },
              "required": [
                "data"
              ]
            }
        """.trimIndent()
    }
}