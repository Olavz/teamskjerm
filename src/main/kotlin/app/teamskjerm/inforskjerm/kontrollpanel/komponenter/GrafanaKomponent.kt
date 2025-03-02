package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.convertValue

class GrafanaKomponent: KontrollpanelKomponent(
    komponentType = "GrafanaKomponent"
) {

    override fun hukommelse(): Boolean {
        return true
    }

    override fun flettKomponentdataMedHukommelse(
        payload: JsonNode,
        eksisterendeKomponentData: JsonNode
    ): JsonNode {
        val objectMapper = ObjectMapper()

        val grafanaRequest = objectMapper.convertValue(payload, GrafanaRequest::class.java)

        val unikeEksisterende = objectMapper.convertValue<List<GrafanaRequest>>(eksisterendeKomponentData)
            .map { Pair(it.alerts.first().labels.key(), it) }
            .toMutableSet()

        if(grafanaRequest.fireing()) {
            if(!unikeEksisterende.any { it.first == grafanaRequest.key() }) {
                unikeEksisterende.add(Pair(grafanaRequest.key(), grafanaRequest))
            }
        } else if(grafanaRequest.resolved()) {
            if(unikeEksisterende.any { it.first == grafanaRequest.key() }) {
                unikeEksisterende.removeIf { it.first == grafanaRequest.key() }
            }
        }

        return objectMapper.valueToTree(unikeEksisterende.map { it.second }.toList())
    }

    override fun jsonSkjema(): String {
        return """
            {
              "${'$'}schema": "http://json-schema.org/draft-07/schema",
              "${'$'}id": "https://todo/GrafanaKomponent.json",
              "title": "GrafanaKomponent",
              "description": "",
              "type": "object",
              "properties": {
                "receiver": {
                  "description": "Mottager",
                  "type": "string"
                },
                "status": {
                  "description": "Alarmtype",
                  "type": "string",
                  "enum": ["firing", "resolved"]
                }
              },
              "required": ["receiver", "status"]
            }
        """.trimIndent()
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    class GrafanaRequest (
        var receiver: String = "",
        var status: String = "",
        var alerts: List<GrafanaAlert> = emptyList()
    ) {
        fun key(): String {
            return alerts.first().labels.key()
        }

        fun fireing(): Boolean {
            return alerts.first().status.equals("firing")
        }

        fun resolved(): Boolean {
            return alerts.first().status.equals("resolved")
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    data class GrafanaAlert(
        var status: String = "",
        var labels: GrafanaLabels = GrafanaLabels(),
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    class GrafanaLabels(
        var alertname: String = "",
        var grafana_folder: String = ""
    ) {
        fun key(): String {
            return "$grafana_folder $alertname".replace(" ", "_")
        }
    }

}