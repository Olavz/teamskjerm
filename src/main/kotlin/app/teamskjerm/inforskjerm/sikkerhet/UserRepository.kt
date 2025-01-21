package app.teamskjerm.inforskjerm.sikkerhet

import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class UserRepository(
    encoder: PasswordEncoder
) {
    private val users = mutableSetOf(
        User(
            id = UUID.randomUUID(),
            name = "admin",
            password = encoder.encode("admin"),
            role = Role.USER,
        )
    )

    fun findByUsername(name: String): User? =
        users
            .firstOrNull { it.name == name }
}