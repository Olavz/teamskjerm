package app.teamskjerm.inforskjerm.sikkerhet

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthController(
    private val authenticationService: AuthenticationService
) {
    @PostMapping("/api/auth")
    fun authenticate(
        @RequestBody authRequest: AuthenticationRequest
    ): AuthenticationResponse {
        return authenticationService.authentication(authRequest)
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