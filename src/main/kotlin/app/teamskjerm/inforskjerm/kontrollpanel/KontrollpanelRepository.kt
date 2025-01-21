package app.teamskjerm.inforskjerm.kontrollpanel

import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.TekstKomponent
import com.fasterxml.jackson.databind.ObjectMapper
import com.google.cloud.firestore.Firestore
import com.google.cloud.firestore.QuerySnapshot
import org.springframework.stereotype.Repository

private const val COLLECTION = "kontrollpanel"

@Repository
class KontrollpanelRepository(
    val firestore: Firestore,
    val objectMapper: ObjectMapper
) {

    fun alleKontrollpanel(): List<Kontrollpanel> {
        val collectionRef = firestore.collection("kontrollpanel")
        val querySnapshot: QuerySnapshot = collectionRef.get().get()

        return querySnapshot.documents.mapNotNull { document ->
            val data = document.data ?: return@mapNotNull null

            Kontrollpanel(
                id = document.id,
                kontrollpanelUUID = data["kontrollpanelUUID"] as String,
                navn = data["navn"] as String,
                komponenter = data["komponenter"] as List<String>
            )
        }
    }

    fun nyttkontrollpanel(): List<String> {
        val collectionRef = firestore.collection("kontrollpanel")

        val id = firestore.collection("komponenter")
            .add(
                TekstKomponent(
                    "", // Genereres av firestore
                    "a-b-c-d",
                    "ladida",
                    "{\"tekst\": \"-\"}"
                )
            )
            .get()
            .id

        collectionRef.add(Kontrollpanel(
            "",
            "uuid-1-2-3-4",
            "en test",
            listOf(
               id
            )
        ))

        return emptyList()
    }

    fun finnKontrollpanel(kontrollpanelUUID: String): Kontrollpanel {
        return firestore.collection("kontrollpanel")
            .whereEqualTo("kontrollpanelUUID", kontrollpanelUUID)
            .get()
            .get()
            .documents
            .mapNotNull { document ->
                val data = document.data ?: return@mapNotNull null

                Kontrollpanel(
                    id = document.id,
                    kontrollpanelUUID = data["kontrollpanelUUID"] as String,
                    navn = data["navn"] as String,
                    komponenter = data["komponenter"] as List<String>
                )
            }
            .single()
    }

    fun lagre(kontrollpanel: Kontrollpanel): Kontrollpanel {
        val kontrollpaneler = firestore.collection(COLLECTION)

        if(kontrollpanel.id.isNotBlank()) {
            kontrollpaneler
                .document(kontrollpanel.id)
                .set(kontrollpanel)
            return kontrollpanel
        } else {
            val f = kontrollpaneler.add(kontrollpanel).get()
            val convertValue = objectMapper.convertValue(f.get(), Kontrollpanel::class.java)
            convertValue.id = f.id
            return convertValue
        }

    }

}