package app.teamskjerm.inforskjerm.sikkerhet.repository

import app.teamskjerm.inforskjerm.sikkerhet.Bruker

interface BrukerPort {
    fun hentBruker(navn: String): Bruker?
    fun lagre(bruker: Bruker): Bruker
}