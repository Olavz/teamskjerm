package app.teamskjerm.inforskjerm.sikkerhet

import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.stereotype.Service
import java.util.Date

@Service
class AuthenticationService(
    private val authManager: AuthenticationManager,
    private val userDetailsService: UserDetailsService,
    private val tokenService: TokenService,
    @Value("\${jwt.accessTokenExpiration}") private val accessTokenExpiration: Long = 0,
    @Value("\${jwt.refreshTokenExpiration}") private val refreshTokenExpiration: Long = 0
) {
    fun authentication(authenticationRequest: AuthenticationRequest): AuthenticationResponse {
        authManager.authenticate(
            UsernamePasswordAuthenticationToken(
                authenticationRequest.username,
                authenticationRequest.password
            )
        )

        val user = userDetailsService.loadUserByUsername(authenticationRequest.username) as TeamskjermUserDetails

        val accessToken = createAccessToken(user)
        val refreshToken = createRefreshToken(user)


        return AuthenticationResponse(
            accessToken = accessToken,
        )
    }

    private fun createAccessToken(user: TeamskjermUserDetails): String {
        return tokenService.generateToken(
            userId = user.id(),
            subject = user.username,
            expiration = Date(System.currentTimeMillis() + accessTokenExpiration)
        )
    }

    private fun createRefreshToken(user: TeamskjermUserDetails) = tokenService.generateToken(
        userId = user.id(),
        subject = user.username,
        expiration = Date(System.currentTimeMillis() + refreshTokenExpiration)
    )

    fun extractUsernameFromToken(token: String): String {
        return tokenService.extractUsername(token)
    }
}