package app.teamskjerm.inforskjerm;

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.nio.file.Files
import java.nio.file.Paths

@Service
class SecretReaderService {

    @Value("\${secrets.path:/secrets/teamskjerm-firestore}")
    private val secretsPath: String? = null

    @Throws(Exception::class)
    fun firestoreSecret(): String {
        val filePath = Paths.get(secretsPath, "teamskjerm-firestore:latest")
        return Files.readString(filePath)
    }
}

