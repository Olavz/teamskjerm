package app.teamskjerm.inforskjerm.sikkerhet

import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException

class JwtUserDetailsService(
    private val brukerRepository: BrukerRepository
) : UserDetailsService {
    override fun loadUserByUsername(username: String): UserDetails {
        val user = brukerRepository.finnBruker(username)
            ?: throw UsernameNotFoundException("User $username not found!")

        return TeamskjermUserDetails(
            user.id,
            user.navn,
            user.passord
        )
    }
}