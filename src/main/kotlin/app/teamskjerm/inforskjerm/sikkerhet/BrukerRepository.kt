package app.teamskjerm.inforskjerm.sikkerhet

import com.fasterxml.jackson.databind.ObjectMapper
import com.google.cloud.firestore.Firestore
import org.springframework.stereotype.Repository

@Repository
class BrukerRepository(
    val firestore: Firestore,
    val objectMapper: ObjectMapper
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

        if(bruker.id.isNotBlank()) {
            brukere
                .document(bruker.id)
                .set(bruker)
            return bruker
        } else {
            val f = brukere.add(bruker).get()
            val convertValue = objectMapper.convertValue(f.get(), Bruker::class.java)
            convertValue.id = f.id
            return convertValue
        }
    }

}