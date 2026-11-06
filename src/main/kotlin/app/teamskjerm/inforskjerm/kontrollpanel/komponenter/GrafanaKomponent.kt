package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import tools.jackson.databind.JsonNode
import tools.jackson.databind.json.JsonMapper
import tools.jackson.module.kotlin.convertValue


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
        val jsonMapper = JsonMapper.builder().build()

        val grafanaRequest = jsonMapper.convertValue(payload, GrafanaRequest::class.java)

        val aktiveVarsler = LinkedHashMap<String, GrafanaRequest>()
        jsonMapper.convertValue<List<GrafanaRequest>>(eksisterendeKomponentData)
            .filter { !it.alerts.isNullOrEmpty() }
            .forEach { aktiveVarsler.putIfAbsent(it.key(), it) }

        // Grafana grupperer varsler, så én webhook kan inneholde flere alerts med ulik status
        grafanaRequest.alerts.orEmpty().forEach { alert ->
            val key = alert.labels?.key() ?: GrafanaLabels().key()
            when (alert.status) {
                "firing" -> aktiveVarsler.putIfAbsent(
                    key,
                    GrafanaRequest(grafanaRequest.receiver, alert.status, listOf(alert))
                )
                "resolved" -> aktiveVarsler.remove(key)
            }
        }

        return jsonMapper.valueToTree(aktiveVarsler.values.toList())
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

    // Feltene er nullable fordi Grafana kan utelate labels (f.eks. grafana_folder) eller sende null,
    // og mapperen her har ikke Kotlin-modulen som ville brukt default-verdiene.
    @JsonIgnoreProperties(ignoreUnknown = true)
    class GrafanaRequest(
        var receiver: String? = null,
        var status: String? = null,
        var alerts: List<GrafanaAlert>? = null
    ) {
        fun key(): String {
            return alerts.orEmpty().first().labels?.key() ?: ""
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    class GrafanaAlert(
        var status: String? = null,
        var labels: GrafanaLabels? = null,
    )

    @JsonIgnoreProperties(ignoreUnknown = true)
    class GrafanaLabels(
        var alertname: String? = null,
        var grafana_folder: String? = null
    ) {
        fun key(): String {
            return "${grafana_folder.orEmpty()} ${alertname.orEmpty()}".replace(" ", "_")
        }
    }

}
