package app.teamskjerm.inforskjerm.kontrollpanel.komponenter.repository

import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.KontrollpanelKomponent
import app.teamskjerm.inforskjerm.sikkerhet.KomponentSecretHashkeyService
import org.bson.Document
import org.bson.json.JsonMode
import org.bson.json.JsonWriterSettings
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import tools.jackson.databind.json.JsonMapper
import java.util.UUID

private const val COLLECTION = "komponenter"

private val jsonWriterSettings: JsonWriterSettings = JsonWriterSettings.builder()
    .outputMode(JsonMode.RELAXED)
    .build()

class KomponentMongoRepository(
    val mongoTemplate: MongoTemplate,
    val jsonMapper: JsonMapper,
    val komponentSecretHashkeyService: KomponentSecretHashkeyService
) : KomponentPort {

    override fun lagre(kontrollpanelKomponent: KontrollpanelKomponent): KontrollpanelKomponent {
        if (kontrollpanelKomponent.id.isBlank()) {
            kontrollpanelKomponent.secret = UUID.randomUUID().toString().replace("-", "")
            kontrollpanelKomponent.secretHashKey = komponentSecretHashkeyService.hashkey(
                kontrollpanelKomponent.komponentUUID,
                kontrollpanelKomponent.secret ?: ""
            )
            kontrollpanelKomponent.id = UUID.randomUUID().toString()
        }
        val doc = tilDoc(kontrollpanelKomponent)
        doc.remove("id")
        doc["_id"] = kontrollpanelKomponent.id
        mongoTemplate.save(doc, COLLECTION)
        return kontrollpanelKomponent
    }

    override fun hentKomponentMedKomponentUUID(komponentUUID: String): KontrollpanelKomponent? {
        val doc = mongoTemplate.findOne(
            Query.query(Criteria.where("komponentUUID").`is`(komponentUUID)),
            Document::class.java,
            COLLECTION
        ) ?: return null
        return fraDoc(doc)
    }

    override fun hentKomponenterMedUUID(komponenter: List<String>): List<KontrollpanelKomponent>? {
        if (komponenter.isEmpty()) return emptyList()
        return mongoTemplate.find(
            Query.query(Criteria.where("komponentUUID").`in`(komponenter)),
            Document::class.java,
            COLLECTION
        ).map { fraDoc(it) }
    }

    override fun hentKomponenterMedUUIDUtenSecret(komponenter: List<String>): List<KontrollpanelKomponent>? {
        if (komponenter.isEmpty()) return emptyList()
        return mongoTemplate.find(
            Query.query(Criteria.where("komponentUUID").`in`(komponenter)),
            Document::class.java,
            COLLECTION
        ).map { komponent ->
            fraDoc(komponent).also {
                it.secret = ""
                it.secretHashKey = ""
            }
        }
    }

    override fun slett(komponentUUID: String): String {
        mongoTemplate.remove(
            Query.query(Criteria.where("komponentUUID").`is`(komponentUUID)),
            COLLECTION
        )
        return komponentUUID
    }

    private fun tilDoc(komponent: KontrollpanelKomponent): Document =
        Document.parse(jsonMapper.writeValueAsString(komponent))

    private fun fraDoc(doc: Document): KontrollpanelKomponent {
        val id = doc.getString("_id")
        val kopi = Document(doc).apply {
            remove("_id")
            put("id", id)
        }
        return jsonMapper.readValue(kopi.toJson(jsonWriterSettings), KontrollpanelKomponent::class.java)
    }
}
