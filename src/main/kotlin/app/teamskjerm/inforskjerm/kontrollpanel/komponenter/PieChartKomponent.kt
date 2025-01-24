package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

class PieChartKomponent: KontrollpanelKomponent(
    komponentType = "PieChartKomponent"
) {

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