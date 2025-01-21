import {Button, FormSelect, Modal} from "react-bootstrap";
import {useState} from "react";
import {useParams} from "react-router-dom";
import {KontrollpanelKomponent} from "./KomponentKontrollpanel.tsx";
import {v4 as uuidv4} from 'uuid';


type KontrollpanelParams = {
    kontrollpanelUUID: string;
};

type LeggTilKomponentProps = {
    opprettKomponent: (komponentUUID: string, kontrollpaneKomponent: KontrollpanelKomponent) => void;
};

export const LeggTilKomponentButton : React.FC<LeggTilKomponentProps> = ({opprettKomponent}) => {
    const {kontrollpanelUUID} = useParams<KontrollpanelParams>();
    const [show, setShow] = useState(false);
    const [valgtVeiviser, setValgtVeiviser] = useState("");

    // Håndter modalvisning
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const nyttKomponent = () => {

        if (!kontrollpanelUUID) {
            throw Error("asd")
        }

        let tomData: string
        if(valgtVeiviser == "TekstKomponent") {
            tomData = '{"tekst": ""}'
        } else if(valgtVeiviser == "VarselKomponent") {
            tomData = '{"tekst": "", "varseltype": "grønnt"}'
        } else if(valgtVeiviser == "PieChartKomponent") {
            tomData = '[]'
        } else {
            throw new Error("Har ikke standard mal for varselType "+ valgtVeiviser)
        }

        let obj = {
            navn: "Nytt komponent",
            data: tomData,
            komponentUUID: uuidv4(),
            komponentType: valgtVeiviser
        } as KontrollpanelKomponent
        opprettKomponent(kontrollpanelUUID, obj)
        handleClose()
    }

    return (
        <>
            {/* Knapp for å åpne modal */}
            <Button variant="primary" onClick={handleShow}>
                Nytt komponent
            </Button>

            {/* Modal-komponent */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Nytt komponent</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <p>Navn</p>
                    <p>Info url</p>

                    <FormSelect onChange={(e) => setValgtVeiviser(e.target.value)}>
                        <option value="">Velg mal</option>
                        <option value="TekstKomponent">Tekst</option>
                        <option value="VarselKomponent">Varsel</option>
                        <option value="PieChartKomponent">Pie chart</option>
                    </FormSelect>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Lukk
                    </Button>
                    <Button variant="primary" onClick={nyttKomponent}>
                        Opprett
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    )
}