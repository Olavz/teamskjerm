package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.databind.ObjectMapper
import com.networknt.schema.JsonSchema
import com.networknt.schema.JsonSchemaFactory
import com.networknt.schema.SpecVersion

data class Skjemavalidering(val harFeil: Boolean, val skjemafeil: List<String>)

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "komponentType"
)
@JsonSubTypes(
    value = [
        JsonSubTypes.Type(value = TekstKomponent::class, name = "TekstKomponent"),
        JsonSubTypes.Type(value = VarselKomponent::class, name = "VarselKomponent"),
        JsonSubTypes.Type(value = PieChartKomponent::class, name = "PieChartKomponent")
    ]
)
interface KontrollpanelKomponent {
    var id: String
    var komponentUUID: String
    var navn: String
    var data: String
    var komponentType: String
    var seMerInformasjon: String

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