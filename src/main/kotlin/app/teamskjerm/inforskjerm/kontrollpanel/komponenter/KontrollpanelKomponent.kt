package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.ObjectMapper
import com.networknt.schema.JsonSchema
import com.networknt.schema.JsonSchemaFactory
import com.networknt.schema.SpecVersion

data class Skjemavalidering(val harFeil: Boolean, val skjemafeil: List<String>)

interface KontrollpanelKomponent {
    val id: String
    var navn: String
    var data: String

    @JsonProperty(value = "komponentNavn", required = true)
    fun komponentNavn(): String

    @JsonProperty(value = "jsonSkjema", required = true)
    fun jsonSkjema(): String

    fun validerSkjema(dataJson: String): Skjemavalidering {
        val schemaFactory = JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V7)
        val schema: JsonSchema = schemaFactory.getSchema(jsonSkjema())
        val objectMapper = ObjectMapper()

        val jsonNode = objectMapper.readTree(dataJson)
        val validationErrors = schema.validate(jsonNode)

        return Skjemavalidering(!validationErrors.isEmpty(), validationErrors.map { it.message })
    }
}