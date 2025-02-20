import {Container, Nav, Navbar} from "react-bootstrap";
import {NavLink} from "react-router-dom";

export default function NavbarInnlogget() {

    return (
        <>
            <Navbar bg="light" variant="light" expand="lg">
                <Container>
                    <Navbar.Brand as={NavLink} to="/">Teamskjerm</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link as={NavLink} to="/kontrollpanel">Mine kontrollpanel</Nav.Link>
                            <Nav.Link as={NavLink} to="/loggut">Logg ut</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

        </>

    )
}