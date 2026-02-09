package app.teamskjerm.inforskjerm.kontrollpanel

import com.google.cloud.firestore.Firestore
import org.springframework.stereotype.Repository
import tools.jackson.databind.json.JsonMapper

private const val COLLECTION = "kontrollpanel"

@Repository
class KontrollpanelRepository(
    val firestore: Firestore,
    val jsonMapper: JsonMapper
) {

    fun kontrollpanelForBruker(brukerId: String): List<Kontrollpanel> {
        return firestore.collection("kontrollpanel")
            .whereEqualTo("eierId", brukerId)
            .get()
            .get()
            .documents.mapNotNull { document ->
                val data = document.data ?: return@mapNotNull null

                Kontrollpanel(
                    id = document.id,
                    kontrollpanelUUID = data["kontrollpanelUUID"] as String,
                    navn = data["navn"] as String,
                    eierId = data["eierId"] as String,
                    komponenter = data["komponenter"] as List<String>,
                    komponentPlassering = data["komponentPlassering"] as? String ?: ""
                )
            }
    }

    fun finnKontrollpanel(kontrollpanelUUID: String): Kontrollpanel {
        return firestore.collection("kontrollpanel")
            .whereEqualTo("kontrollpanelUUID", kontrollpanelUUID)
            .get()
            .get()
            .documents
            .mapNotNull { document ->
                val data = document.data ?: return@mapNotNull null
                jsonMapper.convertValue(data, Kontrollpanel::class.java).apply {
                    id = document.id
                }
            }
            .single()
    }

    fun lagre(kontrollpanel: Kontrollpanel): Kontrollpanel {
        val kontrollpaneler = firestore.collection(COLLECTION)

        if (kontrollpanel.id.isNotBlank()) {
            kontrollpaneler
                .document(kontrollpanel.id)
                .set(kontrollpanel)
            return kontrollpanel
        } else {
            val f = kontrollpaneler.add(kontrollpanel).get()
            val convertValue = jsonMapper.convertValue(f.get(), Kontrollpanel::class.java)
            convertValue.id = f.id
            return convertValue
        }

    }

}