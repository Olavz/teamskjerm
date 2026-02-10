package app.teamskjerm.inforskjerm.sikkerhet

import app.teamskjerm.inforskjerm.sikkerhet.repository.BrukerPort
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.factory.PasswordEncoderFactories
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
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
        val encoder = PasswordEncoderFactories.createDelegatingPasswordEncoder()
        brukerRepository.lagre(Bruker(
            "",
            authRequest.username,
            encoder.encode(authRequest.password)!!
        ))
        return ResponseEntity.ok("User registered successfully")
    }

    @GetMapping("/api/user")
    fun hentBruker(
    ): ResponseEntity<Test> {
        return ResponseEntity.ok(Test("Hello"))
    }
}

data class Test(
    val name: String
)