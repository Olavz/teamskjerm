package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

import com.fasterxml.jackson.databind.ObjectMapper
import com.google.cloud.firestore.Firestore
import org.springframework.stereotype.Repository

private const val COLLECTION = "komponenter"

@Repository
class KomponentRepository(
    val firestore: Firestore,
    val objectMapper: ObjectMapper
) {

    fun lagreKomponent(kontrollpanelKomponent: KontrollpanelKomponent) {
        val komponenter = firestore.collection(COLLECTION)

        if(kontrollpanelKomponent.id.isNotBlank()) {
            komponenter
                .document(kontrollpanelKomponent.id)
                .set(kontrollpanelKomponent)
        } else {
            komponenter.add(kontrollpanelKomponent)
        }

    }

    fun finnKomponent(id: String): KontrollpanelKomponent {
        val document1 = firestore.collection(COLLECTION).document(id)
        val get = document1.get().get()
        val komponent = objectMapper.convertValue(get, KontrollpanelKomponent::class.java)
        komponent.id = get.id
        return komponent
    }

    fun finnKomponentMedKomponentUUID(komponentUUID: String): KontrollpanelKomponent? {
        return firestore.collection(COLLECTION)
            .whereEqualTo("komponentUUID", komponentUUID)
            .get()
            .get()
            .documents
            .map {
                val komponent = objectMapper.convertValue(it.data, KontrollpanelKomponent::class.java)
                komponent.id = it.id
                komponent
            }
            .single()
    }

    fun finnKomponenterMedId(komponenter: List<String>): List<KontrollpanelKomponent>? {

        return komponenter
            .map {
                firestore.collection(COLLECTION).document(it).get().get()
            }
            .filter { it.exists() }
            .map {
                val komponent = objectMapper.convertValue(it.data, KontrollpanelKomponent::class.java)
                komponent.id = it.id
                komponent
            }

    }

}