package app.teamskjerm.inforskjerm.sikkerhet

import org.springframework.stereotype.Service
import java.security.MessageDigest

@Service
class KomponentSecretHashkeyService {

    fun hashkey(komponentUUID: String, secret: String): String {
        return hashString("$komponentUUID:$secret").takeLast(5)
    }

    private fun hashString(input: String): String {
        val bytes = input.toByteArray()
        val digest = MessageDigest.getInstance("SHA-256")
        val hashBytes = digest.digest(bytes)
        return hashBytes.joinToString("") { "%02x".format(it) }
    }

}