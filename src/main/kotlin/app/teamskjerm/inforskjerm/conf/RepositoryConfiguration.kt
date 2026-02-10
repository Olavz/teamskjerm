package app.teamskjerm.inforskjerm.conf

import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.repository.KomponentFirestoreRepository
import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.repository.KomponentPort
import app.teamskjerm.inforskjerm.kontrollpanel.repository.KontrollpanelFirestoreRepository
import app.teamskjerm.inforskjerm.kontrollpanel.repository.KontrollpanelPort
import app.teamskjerm.inforskjerm.sikkerhet.KomponentSecretHashkeyService
import app.teamskjerm.inforskjerm.sikkerhet.repository.BrukerPort
import app.teamskjerm.inforskjerm.sikkerhet.repository.BrukerFirestoreRepository
import com.google.cloud.firestore.Firestore
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import tools.jackson.databind.json.JsonMapper

@Configuration
class RepositoryConfiguration {

    @Autowired
    lateinit var firestore: Firestore
    @Autowired
    lateinit var jsonMapper: JsonMapper
    @Autowired
    lateinit var komponentSecretHashkeyService: KomponentSecretHashkeyService


    @Bean
    fun kontrollpanelRepository(): KontrollpanelPort {
        return KontrollpanelFirestoreRepository(
            firestore,
            jsonMapper
        )
    }


    @Bean
    fun brukerRepository(): BrukerPort {
        return BrukerFirestoreRepository(
            firestore,
            jsonMapper
        )
    }

    @Bean
    fun komponenterRepository(): KomponentPort {
        return KomponentFirestoreRepository(
            firestore,
            jsonMapper,
            komponentSecretHashkeyService
        )
    }

}