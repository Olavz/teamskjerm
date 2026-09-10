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
            komponenter.document(kontrollpanelKomponent.id).set(kontrollpanelKomponent)
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
            .singleOrNull()
    }

    override fun hentKomponenterMedUUID(komponenter: List<String>): List<KontrollpanelKomponent>? {
        if (komponenter.isEmpty()) return emptyList()
        return firestore.collection(COLLECTION)
            .whereIn("komponentUUID", komponenter)
            .get()
            .get()
            .documents
            .map {
                val komponent = jsonMapper.convertValue(it.data, KontrollpanelKomponent::class.java)
                komponent.id = it.id
                komponent
            }
    }

    override fun hentKomponenterMedUUIDUtenSecret(komponenter: List<String>): List<KontrollpanelKomponent>? {
        if (komponenter.isEmpty()) return emptyList()
        return firestore.collection(COLLECTION)
            .whereIn("komponentUUID", komponenter)
            .get()
            .get()
            .documents
            .map {
                val komponent = jsonMapper.convertValue(it.data, KontrollpanelKomponent::class.java)
                komponent.id = it.id
                komponent.secret = ""
                komponent.secretHashKey = ""
                komponent
            }
    }

    override fun slett(komponentUUID: String): String {
        val docs = firestore.collection(COLLECTION)
            .whereEqualTo("komponentUUID", komponentUUID)
            .get()
            .get()
            .documents

        docs.forEach { firestore.collection(COLLECTION).document(it.id).delete() }
        return komponentUUID
    }
}
