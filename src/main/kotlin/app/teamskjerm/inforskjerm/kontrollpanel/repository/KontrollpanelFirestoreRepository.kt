package app.teamskjerm.inforskjerm.kontrollpanel.repository

import app.teamskjerm.inforskjerm.kontrollpanel.Kontrollpanel
import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.repository.KomponentPort
import com.google.cloud.firestore.Firestore
import tools.jackson.databind.json.JsonMapper

private const val COLLECTION = "kontrollpanel"

class KontrollpanelFirestoreRepository(
    val firestore: Firestore,
    val jsonMapper: JsonMapper,
    val komponentPort: KomponentPort
): KontrollpanelPort {

    override fun hentKontrollpanelForBruker(brukerId: String): List<Kontrollpanel> {
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

    override fun hentKontrollpanel(kontrollpanelId: String): Kontrollpanel {
        return firestore.collection("kontrollpanel")
            .whereEqualTo("kontrollpanelUUID", kontrollpanelId)
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

    override fun lagre(kontrollpanel: Kontrollpanel): Kontrollpanel {
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

    override fun slett(kontrollpanelUUID: String): Boolean {

        val kontrollpanel = hentKontrollpanel(kontrollpanelUUID)

        kontrollpanel
            .komponenter
            .map { komponentPort.slettId(it) }

        firestore.collection(COLLECTION).document(kontrollpanel.id).delete()

        return true
    }

}