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
    fun lagre(kontrollpanelKomponent: KontrollpanelKomponent): KontrollpanelKomponent {
        val komponenter = firestore.collection(COLLECTION)

        if(kontrollpanelKomponent.id.isNotBlank()) {
            komponenter
                .document(kontrollpanelKomponent.id)
                .set(kontrollpanelKomponent)
            return kontrollpanelKomponent
        } else {
            val f = komponenter.add(kontrollpanelKomponent).get()
            kontrollpanelKomponent.id = f.id
            return kontrollpanelKomponent
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

    fun slettKomponentMed(komponentUUID: String): String {

        val komponentId = firestore.collection(COLLECTION)
            .whereEqualTo("komponentUUID", komponentUUID)
            .get()
            .get()
            .documents
            .map { it.id }
            .single()

        firestore.collection(COLLECTION).document(komponentId).delete()

        return komponentId
    }

}