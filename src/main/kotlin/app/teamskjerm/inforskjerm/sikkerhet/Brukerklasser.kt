package app.teamskjerm.inforskjerm.sikkerhet

import java.util.UUID

data class User(
    val id: UUID,
    val name: String,
    val password: String,
    val role: Role
)

enum class Role {
    USER, ADMIN
}

data class AuthenticationResponse(
    val accessToken: String,
)

data class AuthenticationRequest(
    val username: String,
    val password: String,
)