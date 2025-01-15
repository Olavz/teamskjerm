package app.teamskjerm.inforskjerm

import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.firestore.Firestore
import com.google.cloud.firestore.FirestoreOptions
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.io.FileInputStream
import java.nio.file.Files
import java.nio.file.Paths

@Configuration
class FirestoreConfig {

    @Value("\${secrets.path:/secrets/teamskjerm-firestore}")
    private val secretsPath: String? = null

    @Throws(Exception::class)
    fun firestoreSecret(): String {
        val filePath = Paths.get(secretsPath)
        return Files.readString(filePath)
    }

    @Bean
    fun firestoreClient(): Firestore {
//        val credentialsPath = "src/main/resources/monitor-404-firestore-credentials.json"
//        val credentials = GoogleCredentials.fromStream(FileInputStream(credentialsPath))

        val credentials = GoogleCredentials.fromStream(FileInputStream(firestoreSecret()))

        val options = FirestoreOptions.newBuilder()
            .setCredentials(credentials)
            .setProjectId("monitor-404")
            .setDatabaseId("teamskjerm")
            .build()

        return options.service
    }
}