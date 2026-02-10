package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.google.cloud.Timestamp
import com.networknt.schema.InputFormat
import com.networknt.schema.Schema
import com.networknt.schema.SchemaRegistry
import com.networknt.schema.SpecificationVersion
import tools.jackson.databind.JsonNode

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
        JsonSubTypes.Type(value = PieChartKomponent::class, name = "PieChartKomponent"),
        JsonSubTypes.Type(value = BarChartKomponent::class, name = "BarChartKomponent"),
        JsonSubTypes.Type(value = StackedAreaChartKomponent::class, name = "StackedAreaChartKomponent"),
    ]
)
abstract class KontrollpanelKomponent(
    var id: String = "",
    var komponentUUID: String = "",
    var navn: String = "",
    var data: String = "",
    var komponentType: String,
    var seMerInformasjon: String? = null,
    var secret: String? = null,
    var secretHashKey: String? = null,
    var sistOppdatert: Timestamp? = null,
    var utdatertKomponentEtterMinutter: Number? = null,
    var sistOppdatertMedDataDiff: Timestamp? = null,
) {


    @JsonProperty(value = "jsonSkjema", required = true)
    abstract fun jsonSkjema(): String

    open fun hukommelse(): Boolean = false

    open fun flettKomponentdataMedHukommelse(payload: JsonNode, eksisterendeKomponentData: JsonNode): JsonNode =
        payload

    fun validerSkjema(dataJson: String): Skjemavalidering {
        val registry = SchemaRegistry.withDefaultDialect(SpecificationVersion.DRAFT_7)
        val schema: Schema = registry.getSchema(jsonSkjema(), InputFormat.JSON)
        val errors: List<com.networknt.schema.Error> = schema.validate(dataJson, InputFormat.JSON)

        return Skjemavalidering(
            harFeil = errors.isNotEmpty(),
            skjemafeil = errors.map { it.message }
        )
    }
}