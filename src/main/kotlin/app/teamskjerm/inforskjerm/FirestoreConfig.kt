package app.teamskjerm.inforskjerm

import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.firestore.Firestore
import com.google.cloud.firestore.FirestoreOptions
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.core.io.Resource

@Profile("!test")
@Configuration
class FirestoreConfig {


    @Value("file:\${firestore.secret.path}")
    private lateinit var firestoreSecretResource: Resource

    @Bean
    fun firestoreClient(): Firestore {
        val credentials = GoogleCredentials.fromStream(firestoreSecretResource.inputStream)

        val options = FirestoreOptions.newBuilder()
            .setCredentials(credentials)
            .setProjectId("monitor-404")
            .setDatabaseId("teamskjerm")
            .build()

        return options.service
    }
}