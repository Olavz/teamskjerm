import {Alert, Button, Container, Form} from "react-bootstrap";
import {useState} from "react";
import {NavLink} from "react-router-dom";


function Registreringsside() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleRegistrering = async (event: React.FormEvent) => {
        event.preventDefault();
        setSuccess(null);
        setError(null);
        try {
            const response = await fetch(`/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
            });
            if (response.ok) {
                setSuccess("Bruker registrert!");
                setUsername("");
                setPassword("");
            } else {
                const text = await response.text();
                setError(text || "Registrering feilet. Prøv igjen.");
            }
        } catch {
            setError("Registrering feilet. Prøv igjen senere.");
        }
    }

    return (
        <Container className="mt-5" style={{maxWidth: "400px"}}>
            <h2 className="mb-4">Registrer</h2>
            {success && (
                <Alert variant="success">{success} <br/> <br/> <NavLink to="/logginn">Til logg inn</NavLink></Alert>
            )}
            {error && (
                <Alert variant="danger">{error}</Alert>
            )}
            <Form onSubmit={handleRegistrering}>
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
                    Registrer
                </Button>
            </Form>
        </Container>
    );

}

export default Registreringsside
