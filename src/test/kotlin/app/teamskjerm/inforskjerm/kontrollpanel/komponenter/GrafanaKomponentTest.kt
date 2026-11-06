package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Test
import tools.jackson.databind.JsonNode
import tools.jackson.databind.json.JsonMapper

class GrafanaKomponentTest {

    private val jsonMapper = JsonMapper.builder().build()
    private val komponent = GrafanaKomponent()

    private fun webhook(status: String, vararg alerts: Pair<String, String>): JsonNode =
        jsonMapper.readTree(
            """
            {
              "receiver": "teamskjerm",
              "status": "$status",
              "alerts": [${
                alerts.joinToString(",") { (navn, alertStatus) ->
                    """{"status": "$alertStatus", "labels": {"alertname": "$navn", "grafana_folder": "Drift"}}"""
                }
            }]
            }
            """
        )

    private fun aktive(data: JsonNode): List<String> =
        (0 until data.size()).map { i -> data.get(i).get("alerts").get(0).get("labels").get("alertname").asString() }

    @Test
    fun `legger til alle firing alerts i en gruppert webhook`() {
        val resultat = komponent.flettKomponentdataMedHukommelse(
            webhook("firing", "CPU" to "firing", "Disk" to "firing"),
            jsonMapper.readTree("[]")
        )
        assertEquals(listOf("CPU", "Disk"), aktive(resultat))
    }

    @Test
    fun `fjerner resolved og beholder firing i samme webhook`() {
        val eksisterende = komponent.flettKomponentdataMedHukommelse(
            webhook("firing", "CPU" to "firing", "Disk" to "firing"),
            jsonMapper.readTree("[]")
        )
        val resultat = komponent.flettKomponentdataMedHukommelse(
            webhook("firing", "CPU" to "resolved", "Disk" to "firing", "Minne" to "firing"),
            eksisterende
        )
        assertEquals(listOf("Disk", "Minne"), aktive(resultat))
    }

    @Test
    fun `duplikat firing gir ikke dobbel oppføring`() {
        val første = komponent.flettKomponentdataMedHukommelse(
            webhook("firing", "CPU" to "firing"),
            jsonMapper.readTree("[]")
        )
        val resultat = komponent.flettKomponentdataMedHukommelse(webhook("firing", "CPU" to "firing"), første)
        assertEquals(listOf("CPU"), aktive(resultat))
    }

    @Test
    fun `tom alerts-liste krasjer ikke`() {
        val resultat = komponent.flettKomponentdataMedHukommelse(
            jsonMapper.readTree("""{"receiver": "teamskjerm", "status": "firing", "alerts": []}"""),
            jsonMapper.readTree("[]")
        )
        assertEquals(0, resultat.size())
    }

    @Test
    fun `alert uten grafana_folder eller med null-verdier krasjer ikke`() {
        val payload = jsonMapper.readTree(
            """
            {
              "receiver": "teamskjerm",
              "status": "firing",
              "alerts": [
                {"status": "firing", "labels": {"alertname": "CPU"}},
                {"status": "firing", "labels": {"alertname": "Disk", "grafana_folder": null}}
              ]
            }
            """
        )
        val resultat = komponent.flettKomponentdataMedHukommelse(payload, jsonMapper.readTree("[]"))
        assertEquals(listOf("CPU", "Disk"), aktive(resultat))

        val løst = komponent.flettKomponentdataMedHukommelse(
            jsonMapper.readTree("""{"receiver": "teamskjerm", "status": "resolved", "alerts": [{"status": "resolved", "labels": {"alertname": "CPU"}}]}"""),
            resultat
        )
        assertEquals(listOf("Disk"), aktive(løst))
    }

    @Test
    fun `GrafanaKomponent kan deserialiseres via komponentType`() {
        val json = """{"komponentType": "GrafanaKomponent", "komponentUUID": "abc", "data": "[]"}"""
        val komponent = jsonMapper.readValue(json, KontrollpanelKomponent::class.java)
        assertEquals(GrafanaKomponent::class, komponent::class)
        assertFalse(komponent.validerSkjema(webhook("firing", "CPU" to "firing").toString()).harFeil)
    }
}
