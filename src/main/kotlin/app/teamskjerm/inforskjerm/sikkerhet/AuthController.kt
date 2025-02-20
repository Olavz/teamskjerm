package app.teamskjerm.inforskjerm.sikkerhet

import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthController(
    private val authenticationService: AuthenticationService,
    private val brukerRepository: BrukerRepository,
    private val encoder: PasswordEncoder
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
        brukerRepository.lagre(Bruker(
            "",
            authRequest.username,
            encoder.encode(authRequest.password)
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