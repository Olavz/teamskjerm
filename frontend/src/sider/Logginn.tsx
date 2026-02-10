import {Alert, Button, Container, Form} from "react-bootstrap";
import {clearTeamskjermTokenCookie, setTeamskjermTokenCookie} from "../CookieHjelper.tsx";
import {useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";

type AccessTokenResponse = {
    accessToken: string
}

function Logginnside() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleLogginn = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        try {
            const response = await fetch(`/api/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
            });

            if(response.ok) {
                const token: AccessTokenResponse = await response.json()
                setTeamskjermTokenCookie(token.accessToken)
                navigate("/kontrollpanel")
            } else {
                setError("Feil brukernavn eller passord.");
                clearTeamskjermTokenCookie();
            }

        } catch {
            setError("Innlogging feilet. Prøv igjen senere.");
            clearTeamskjermTokenCookie()
        }

    }

    return (
        <Container className="mt-5" style={{maxWidth: "400px"}}>
            <h2 className="mb-4">Logg inn</h2>
            {error && (
                <Alert variant="danger">{error}</Alert>
            )}
            <Form onSubmit={handleLogginn}>
                <Form.Group controlId="username">
                    <Form.Label>Brukernavn</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Skriv inn brukernavn"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="password" className="mt-3">
                    <Form.Label>Passord</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Skriv inn passord"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-4">
                    Logg inn
                </Button>

                <br/>
                <br/>

                <NavLink to="/registrer">Registrer bruker</NavLink>
            </Form>
        </Container>
    );

}

export default Logginnside
