package app.teamskjerm.inforskjerm.sikkerhet.repository

import app.teamskjerm.inforskjerm.sikkerhet.Bruker
import com.google.cloud.firestore.Firestore
import tools.jackson.databind.json.JsonMapper
import java.util.UUID

class BrukerFirestoreRepository(
    val firestore: Firestore,
    val jsonMapper: JsonMapper
): BrukerPort {

    override fun hentBruker(navn: String): Bruker? {
        return firestore.collection("brukere")
            .whereEqualTo("navn", navn)
            .get()
            .get()
            .documents
            .mapNotNull { doc ->
                val data = doc.data
                Bruker(
                    id = doc.id,
                    brukerUUID = data["brukerUUID"] as? String ?: "",
                    navn = data["navn"] as String,
                    passord = data["passord"] as String
                )
            }
            .singleOrNull()
    }

    override fun lagre(bruker: Bruker): Bruker {
        val brukere = firestore.collection("brukere")
        val eksisterendeBruker = hentBruker(bruker.navn)

        if (bruker.id.isNotBlank()) {
            brukere.document(bruker.id).set(bruker)
            return bruker
        } else if (eksisterendeBruker == null) {
            val medUUID = bruker.copy(brukerUUID = UUID.randomUUID().toString())
            val f = brukere.add(medUUID).get()
            medUUID.id = f.id
            return medUUID
        } else {
            return eksisterendeBruker
        }
    }
}