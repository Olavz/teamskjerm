package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

class StackedLineChartKomponent: KontrollpanelKomponent(
    komponentType = "StackedLineChartKomponent"
) {

    override fun jsonSkjema(): String {
        return """
            {
              "${'$'}schema": "http://json-schema.org/draft-07/schema",
              "${'$'}id": "https://todo/StackedLineChartKomponent.json",
              "title": "StackedLineChartKomponent",
              "description": "",
              "type": "object",
              "properties": {
                "legend": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "data": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "values": {
                        "type": "array",
                        "items": {
                          "type": "number"
                        }
                      },
                      "name": {
                        "type": "string"
                      }
                    },
                    "required": [
                      "values",
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