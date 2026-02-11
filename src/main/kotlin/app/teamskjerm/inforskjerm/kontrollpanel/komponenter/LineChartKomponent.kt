package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

class LineChartKomponent: KontrollpanelKomponent(
    komponentType = "LineChartKomponent"
) {

    override fun jsonSkjema(): String {
        return """
            {
              "${'$'}schema": "http://json-schema.org/draft-07/schema",
              "${'$'}id": "https://todo/LineChartKomponent.json",
              "title": "LineChartKomponent",
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