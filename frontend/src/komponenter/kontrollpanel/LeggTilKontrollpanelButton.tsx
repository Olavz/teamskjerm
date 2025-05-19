import {Button, Modal} from "react-bootstrap";
import {useState} from "react";
import {v4 as uuidv4} from 'uuid';
import {NyttKontrollpanel} from "../../sider/administrerkontrollpanel/AdministrerKontrollpanel.tsx";


type LeggTilKontrollpanelProps = {
    opprettKontrollpanel: (kontrollpane: NyttKontrollpanel) => void;
};

export const LeggTilKontrollpanelButton: React.FC<LeggTilKontrollpanelProps> = ({opprettKontrollpanel}) => {
    const [show, setShow] = useState(false);
    const [inpNyttKontrollpanelNavn, setInpNyttKontrollpanelNavn] = useState<string>('')

    // Håndter modalvisning
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const nyttKontrollpanel = () => {

        const obj = {
            navn: inpNyttKontrollpanelNavn,
            kontrollpanelUUID: uuidv4()
        } as NyttKontrollpanel
        opprettKontrollpanel(obj)
        setInpNyttKontrollpanelNavn('')
        handleClose()
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInpNyttKontrollpanelNavn(event.target.value);
    };

    return (
        <>
            {/* Knapp for å åpne modal */}
            <Button variant="primary" onClick={handleShow}>
                Nytt kontrollpanel
            </Button>

            {/* Modal-komponent */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Nytt kontrollpanel</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label>Navn</label>
                    <input
                        onChange={handleInputChange}
                        className="form-control"
                        value={inpNyttKontrollpanelNavn}
                        placeholder="Byggskjerm, Helsesjekk..."
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Lukk
                    </Button>
                    <Button variant="primary" onClick={nyttKontrollpanel}>
                        Opprett
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    )
}