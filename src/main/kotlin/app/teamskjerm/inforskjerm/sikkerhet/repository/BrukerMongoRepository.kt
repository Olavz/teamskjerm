package app.teamskjerm.inforskjerm.sikkerhet.repository

import app.teamskjerm.inforskjerm.sikkerhet.Bruker
import org.bson.Document
import org.bson.json.JsonMode
import org.bson.json.JsonWriterSettings
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.query.Criteria
import org.springframework.data.mongodb.core.query.Query
import tools.jackson.databind.json.JsonMapper
import java.util.UUID

private const val COLLECTION = "brukere"

private val jsonWriterSettings: JsonWriterSettings = JsonWriterSettings.builder()
    .outputMode(JsonMode.RELAXED)
    .build()

class BrukerMongoRepository(
    val mongoTemplate: MongoTemplate,
    val jsonMapper: JsonMapper
) : BrukerPort {

    override fun hentBruker(navn: String): Bruker? {
        val doc = mongoTemplate.findOne(
            Query.query(Criteria.where("navn").`is`(navn)),
            Document::class.java,
            COLLECTION
        ) ?: return null
        return fraDoc(doc)
    }

    override fun lagre(bruker: Bruker): Bruker {
        if (hentBruker(bruker.navn) != null) return hentBruker(bruker.navn)!!

        val id = if (bruker.id.isBlank()) UUID.randomUUID().toString() else bruker.id
        val brukerUUID = if (bruker.brukerUUID.isBlank()) UUID.randomUUID().toString() else bruker.brukerUUID
        val lagret = bruker.copy(id = id, brukerUUID = brukerUUID)
        val doc = tilDoc(lagret)
        doc.remove("id")
        doc["_id"] = id
        mongoTemplate.save(doc, COLLECTION)
        return lagret
    }

    private fun tilDoc(bruker: Bruker): Document =
        Document.parse(jsonMapper.writeValueAsString(bruker))

    private fun fraDoc(doc: Document): Bruker {
        val id = doc.getString("_id")
        val kopi = Document(doc).apply {
            remove("_id")
            put("id", id)
        }
        return jsonMapper.readValue(kopi.toJson(jsonWriterSettings), Bruker::class.java)
    }
}
