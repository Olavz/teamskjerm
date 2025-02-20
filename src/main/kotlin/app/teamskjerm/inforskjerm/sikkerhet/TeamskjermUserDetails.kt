package app.teamskjerm.inforskjerm.sikkerhet

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class TeamskjermUserDetails(
    private val id: String,
    private val username: String,
    private val passord: String
) : UserDetails {
    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return mutableListOf()
    }

    fun id(): String {
        return id;
    }

    override fun getPassword(): String {
        return passord
    }

    override fun getUsername(): String {
        return username
    }

}