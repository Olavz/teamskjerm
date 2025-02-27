package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

class BarChartKomponent: KontrollpanelKomponent(
    komponentType = "BarChartKomponent"
) {

    override fun jsonSkjema(): String {
        return """
            {
              "${'$'}schema": "http://json-schema.org/draft-07/schema",
              "${'$'}id": "https://todo/BarChartKomponent.json",
              "title": "BarChartKomponent",
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