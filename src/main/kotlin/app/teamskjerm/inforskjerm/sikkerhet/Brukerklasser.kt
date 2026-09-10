package app.teamskjerm.inforskjerm.sikkerhet

data class Bruker(
    var id: String = "",
    var brukerUUID: String = "",
    val navn: String = "",
    val passord: String = ""
)

data class AuthenticationResponse(
    val accessToken: String,
)

data class AuthenticationRequest(
    val username: String,
    val password: String,
)