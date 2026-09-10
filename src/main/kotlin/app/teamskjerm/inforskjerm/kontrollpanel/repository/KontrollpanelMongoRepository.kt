package app.teamskjerm.inforskjerm.kontrollpanel.repository

import app.teamskjerm.inforskjerm.kontrollpanel.Kontrollpanel
import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.repository.KomponentPort
import org.bson.Document
import org.bson.json.JsonMode
import org.bson.json.JsonWriterSettings
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import tools.jackson.databind.json.JsonMapper
import java.util.UUID

private const val COLLECTION = "kontrollpanel"

private val jsonWriterSettings: JsonWriterSettings = JsonWriterSettings.builder()
    .outputMode(JsonMode.RELAXED)
    .build()

class KontrollpanelMongoRepository(
    val mongoTemplate: MongoTemplate,
    val jsonMapper: JsonMapper,
    val komponentPort: KomponentPort
) : KontrollpanelPort {

    override fun hentKontrollpanelForBruker(brukerId: String): List<Kontrollpanel> {
        return mongoTemplate.find(
            Query.query(Criteria.where("eierId").`is`(brukerId)),
            Document::class.java,
            COLLECTION
        ).map { fraDoc(it) }
    }

    override fun hentKontrollpanel(kontrollpanelId: String): Kontrollpanel {
        val doc = mongoTemplate.findOne(
            Query.query(Criteria.where("kontrollpanelUUID").`is`(kontrollpanelId)),
            Document::class.java,
            COLLECTION
        ) ?: throw NoSuchElementException("Kontrollpanel $kontrollpanelId ikke funnet")
        return fraDoc(doc)
    }

    override fun lagre(kontrollpanel: Kontrollpanel): Kontrollpanel {
        val id = if (kontrollpanel.id.isBlank()) UUID.randomUUID().toString() else kontrollpanel.id
        val lagret = if (kontrollpanel.id.isBlank()) kontrollpanel.copy(id = id) else kontrollpanel
        val doc = tilDoc(lagret)
        doc.remove("id")
        doc["_id"] = id
        mongoTemplate.save(doc, COLLECTION)
        return lagret
    }

    override fun slett(kontrollpanelUUID: String): Boolean {
        val kontrollpanel = hentKontrollpanel(kontrollpanelUUID)
        kontrollpanel.komponenter.forEach { komponentPort.slett(it) }
        mongoTemplate.remove(
            Query.query(Criteria.where("_id").`is`(kontrollpanel.id)),
            COLLECTION
        )
        return true
    }

    private fun tilDoc(kontrollpanel: Kontrollpanel): Document =
        Document.parse(jsonMapper.writeValueAsString(kontrollpanel))

    private fun fraDoc(doc: Document): Kontrollpanel {
        val id = doc.getString("_id")
        val kopi = Document(doc).apply {
            remove("_id")
            put("id", id)
        }
        return jsonMapper.readValue(kopi.toJson(jsonWriterSettings), Kontrollpanel::class.java)
    }
}
