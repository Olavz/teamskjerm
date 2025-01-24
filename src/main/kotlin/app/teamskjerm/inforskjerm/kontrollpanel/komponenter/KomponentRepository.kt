package app.teamskjerm.inforskjerm.kontrollpanel.komponenter

import app.teamskjerm.inforskjerm.sikkerhet.KomponentSecretHashkeyService
import com.fasterxml.jackson.databind.ObjectMapper
import com.google.cloud.firestore.Firestore
import org.springframework.stereotype.Repository
import java.util.UUID

private const val COLLECTION = "komponenter"

@Repository
class KomponentRepository(
    val firestore: Firestore,
    val objectMapper: ObjectMapper,
    val komponentSecretHashkeyService: KomponentSecretHashkeyService
) {
    fun lagre(kontrollpanelKomponent: KontrollpanelKomponent): KontrollpanelKomponent {
        val komponenter = firestore.collection(COLLECTION)

        if(kontrollpanelKomponent.id.isNotBlank()) {
            komponenter
                .document(kontrollpanelKomponent.id)
                .set(kontrollpanelKomponent)
            return kontrollpanelKomponent
        } else {
            kontrollpanelKomponent.secret = UUID.randomUUID().toString().replace("-", "")
            kontrollpanelKomponent.secretHashKey = komponentSecretHashkeyService.hashkey(kontrollpanelKomponent.komponentUUID, kontrollpanelKomponent.secret ?: "")
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

    fun finnKomponenterMedIdUtenSecret(komponenter: List<String>): List<KontrollpanelKomponent>? {
        return komponenter
            .map {
                firestore.collection(COLLECTION).document(it).get().get()
            }
            .filter { it.exists() }
            .map {
                val komponent = objectMapper.convertValue(it.data, KontrollpanelKomponent::class.java)
                komponent.id = it.id
                komponent.secret = ""
                komponent.secretHashKey = ""
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