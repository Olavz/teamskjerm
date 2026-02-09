package app.teamskjerm.inforskjerm.sikkerhet

import com.google.cloud.firestore.Firestore
import org.springframework.stereotype.Repository
import tools.jackson.databind.json.JsonMapper

@Repository
class BrukerRepository(
    val firestore: Firestore,
    val jsonMapper: JsonMapper
) {

    fun finnBruker(navn: String): Bruker? {
        val bruker = firestore.collection("brukere")
            .whereEqualTo("navn", navn)
            .get()
            .get()
            .documents
            .mapNotNull { bruker ->
                val data = bruker.data
                Bruker(
                    id = bruker.id,
                    navn = data["navn"] as String,
                    passord = data["passord"] as String
                )

            }
            .single()
        return bruker;
    }

    fun lagre(bruker: Bruker): Bruker {
        val brukere = firestore.collection("brukere")
        val eksisterendeBruker = brukere
            .listDocuments()
            .map { jsonMapper.convertValue(it.get(), Bruker::class.java) }
            .firstOrNull { it.navn == bruker.navn }

        if (bruker.id.isNotBlank()) {
            brukere
                .document(bruker.id)
                .set(bruker)
            return bruker
        } else if (eksisterendeBruker == null) {
            val f = brukere.add(bruker).get()
            val convertValue = jsonMapper.convertValue(f.get(), Bruker::class.java)
            convertValue.id = f.id
            return convertValue
        } else {
            return eksisterendeBruker
        }
    }

}