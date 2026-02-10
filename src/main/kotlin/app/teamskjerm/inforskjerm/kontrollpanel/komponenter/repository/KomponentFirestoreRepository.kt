package app.teamskjerm.inforskjerm.kontrollpanel.komponenter.repository

import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.KontrollpanelKomponent
import app.teamskjerm.inforskjerm.sikkerhet.KomponentSecretHashkeyService
import com.google.cloud.firestore.Firestore
import tools.jackson.databind.json.JsonMapper
import java.util.UUID

private const val COLLECTION = "komponenter"

class KomponentFirestoreRepository(
    val firestore: Firestore,
    val jsonMapper: JsonMapper,
    val komponentSecretHashkeyService: KomponentSecretHashkeyService
): KomponentPort {
    override fun lagre(kontrollpanelKomponent: KontrollpanelKomponent): KontrollpanelKomponent {
        val komponenter = firestore.collection(COLLECTION)

        if (kontrollpanelKomponent.id.isNotBlank()) {
            komponenter
                .document(kontrollpanelKomponent.id)
                .set(kontrollpanelKomponent)
            return kontrollpanelKomponent
        } else {
            kontrollpanelKomponent.secret = UUID.randomUUID().toString().replace("-", "")
            kontrollpanelKomponent.secretHashKey = komponentSecretHashkeyService.hashkey(
                kontrollpanelKomponent.komponentUUID,
                kontrollpanelKomponent.secret ?: ""
            )
            val f = komponenter.add(kontrollpanelKomponent).get()
            kontrollpanelKomponent.id = f.id
            return kontrollpanelKomponent
        }

    }

    override fun hentKomponentMedKomponentUUID(komponentUUID: String): KontrollpanelKomponent? {
        return firestore.collection(COLLECTION)
            .whereEqualTo("komponentUUID", komponentUUID)
            .get()
            .get()
            .documents
            .map {
                val komponent = jsonMapper.convertValue(it.data, KontrollpanelKomponent::class.java)
                komponent.id = it.id
                komponent
            }
            .single()
    }

    override fun hentKomponenterMedId(komponenter: List<String>): List<KontrollpanelKomponent>? {
        return komponenter
            .map {
                firestore.collection(COLLECTION).document(it).get().get()
            }
            .filter { it.exists() }
            .map {
                val komponent = jsonMapper.convertValue(it.data, KontrollpanelKomponent::class.java)
                komponent.id = it.id
                komponent
            }
    }

    override fun hentKomponenterMedIdUtenSecret(komponenter: List<String>): List<KontrollpanelKomponent>? {
        return komponenter
            .map {
                firestore.collection(COLLECTION).document(it).get().get()
            }
            .filter { it.exists() }
            .map {
                val komponent = jsonMapper.convertValue(it.data, KontrollpanelKomponent::class.java)
                komponent.id = it.id
                komponent.secret = ""
                komponent.secretHashKey = ""
                komponent
            }
    }

    override fun slett(komponentUUID: String): String {

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