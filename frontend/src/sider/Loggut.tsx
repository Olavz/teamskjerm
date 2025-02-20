import {Container} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {clearTeamskjermTokenCookie} from "../CookieHjelper.tsx";


function Loggutside() {

    clearTeamskjermTokenCookie()

    return (
        <Container className="mt-5" style={{maxWidth: "400px"}}>
            <h2 className="mb-4">Du er logget ut</h2>

            <NavLink to="/logginn">Til logg inn</NavLink>
        </Container>
    );

}

export default Loggutside
