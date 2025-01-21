package app.teamskjerm.inforskjerm.sikkerhet

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
}