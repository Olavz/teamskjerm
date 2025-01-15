package app.teamskjerm.inforskjerm

import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.firestore.Firestore
import com.google.cloud.firestore.FirestoreOptions
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class FirestoreConfig {

    @Value("file:/secrets/teamskjerm-firestore")
    private lateinit var secretContent: String

    @Bean
    fun firestoreClient(): Firestore {
//        val credentialsPath = "src/main/resources/monitor-404-firestore-credentials.json"
//        val credentials = GoogleCredentials.fromStream(FileInputStream(credentialsPath))
        val credentials = GoogleCredentials.fromStream(secretContent.byteInputStream())

        val options = FirestoreOptions.newBuilder()
            .setCredentials(credentials)
            .setProjectId("monitor-404")
            .setDatabaseId("teamskjerm")
            .build()

        return options.service
    }
}