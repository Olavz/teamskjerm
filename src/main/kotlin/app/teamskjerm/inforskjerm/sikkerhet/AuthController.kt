package app.teamskjerm.inforskjerm.sikkerhet

import app.teamskjerm.inforskjerm.sikkerhet.repository.BrukerPort
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.factory.PasswordEncoderFactories
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthController(
    private val authenticationService: AuthenticationService,
    private val brukerRepository: BrukerPort
) {
    @PostMapping("/api/auth")
    fun authenticate(
        @RequestBody authRequest: AuthenticationRequest
    ): AuthenticationResponse {
        return authenticationService.authentication(authRequest)
    }

    @PostMapping("/api/register")
    fun registrer(
        @RequestBody authRequest: AuthenticationRequest
    ): ResponseEntity<String> {

        if(brukerRepository.hentBruker(authRequest.username) != null) {
            return ResponseEntity.badRequest().body("Brukernavnet er allerede i bruk")
        }

        val encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder()
        brukerRepository.lagre(Bruker(
            "",
            authRequest.username,
            encoder.encode(authRequest.password)!!
        ))
        return ResponseEntity.ok("Ny bruker registrert")
    }

    @GetMapping("/api/user")
    fun hentBruker(
        @RequestHeader("Authorization") authorizationHeader: String
    ): ResponseEntity<Brukernavn> {
        val token = authorizationHeader.removePrefix("Bearer ").trim()
        val username = authenticationService.extractUsernameFromToken(token)
        return ResponseEntity.ok(Brukernavn(username))
    }
}

data class Brukernavn(
    val name: String
)