package app.teamskjerm.inforskjerm.sikkerhet

import app.teamskjerm.inforskjerm.sikkerhet.repository.BrukerPort
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException

class JwtUserDetailsService(
    private val brukerRepository: BrukerPort
) : UserDetailsService {
    override fun loadUserByUsername(username: String): UserDetails {
        val user = brukerRepository.hentBruker(username)
            ?: throw UsernameNotFoundException("User $username not found!")

        return TeamskjermUserDetails(
            user.id,
            user.navn,
            user.passord
        )
    }
}