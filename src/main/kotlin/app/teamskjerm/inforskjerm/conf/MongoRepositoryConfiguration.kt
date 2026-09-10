package app.teamskjerm.inforskjerm.conf

import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.repository.KomponentMongoRepository
import app.teamskjerm.inforskjerm.kontrollpanel.komponenter.repository.KomponentPort
import app.teamskjerm.inforskjerm.kontrollpanel.repository.KontrollpanelMongoRepository
import app.teamskjerm.inforskjerm.kontrollpanel.repository.KontrollpanelPort
import app.teamskjerm.inforskjerm.sikkerhet.KomponentSecretHashkeyService
import app.teamskjerm.inforskjerm.sikkerhet.repository.BrukerMongoRepository
import app.teamskjerm.inforskjerm.sikkerhet.repository.BrukerPort
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.data.mongodb.core.MongoTemplate
import tools.jackson.databind.json.JsonMapper

@Profile("dev")
@Configuration
class MongoRepositoryConfiguration {

    @Autowired
    lateinit var mongoTemplate: MongoTemplate
    @Autowired
    lateinit var jsonMapper: JsonMapper
    @Autowired
    lateinit var komponentSecretHashkeyService: KomponentSecretHashkeyService

    @Bean
    fun kontrollpanelRepository(komponentPort: KomponentPort): KontrollpanelPort {
        return KontrollpanelMongoRepository(mongoTemplate, jsonMapper, komponentPort)
    }

    @Bean
    fun brukerRepository(): BrukerPort {
        return BrukerMongoRepository(mongoTemplate, jsonMapper)
    }

    @Bean
    fun komponenterRepository(): KomponentPort {
        return KomponentMongoRepository(mongoTemplate, jsonMapper, komponentSecretHashkeyService)
    }
}
