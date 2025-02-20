import {Button, Container, Form} from "react-bootstrap";
import {useState} from "react";


function Registreringsside() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleRegistrering = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await fetch(`/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
            });
        } catch (e) {
            alert(e)
        }

    }

    return (
        <Container className="mt-5" style={{maxWidth: "400px"}}>
            <h2 className="mb-4">Registrer</h2>
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
