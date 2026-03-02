import {Button, Form, FormSelect, Modal} from "react-bootstrap";
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

export const LeggTilKomponentButton: React.FC<LeggTilKomponentProps> = ({opprettKomponent}) => {
    const {kontrollpanelUUID} = useParams<KontrollpanelParams>();
    const [show, setShow] = useState(false);
    const [valgtVeiviser, setValgtVeiviser] = useState("");
    const [navn, setNavn] = useState("")

    // Håndter modalvisning
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const nyttKomponent = () => {

        if (!kontrollpanelUUID) {
            throw Error("asd")
        }

        let tomData: string
        if (valgtVeiviser == "TekstKomponent") {
            tomData = '{"tekst": ""}'
        } else if (valgtVeiviser == "VarselKomponent") {
            tomData = '{"tekst": "", "varseltype": "grønt"}'
        } else if (valgtVeiviser == "PieChartKomponent") {
            tomData = '[]'
        } else if (valgtVeiviser == "BarChartKomponent") {
            tomData = '[]'
        } else if (valgtVeiviser == "GrafanaKomponent") {
            tomData = '[]'
        } else if (valgtVeiviser == "StackedAreaChartKomponent") {
            tomData = '{"data": [], "legend": []}'
        } else if (valgtVeiviser == "LineChartKomponent") {
            tomData = '{"data": [], "legend": []}'
        } else {
            throw new Error("Har ikke standard mal for varselType " + valgtVeiviser)
        }

        const obj = {
            navn: navn,
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
            <Button variant="outline-secondary" onClick={handleShow}>
                ➕ Nytt komponent
            </Button>

            {/* Modal-komponent */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Nytt komponent</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form.Group>
                        <Form.Label>Navn</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nytt komponent"
                            value={navn}
                            onChange={(e) => setNavn(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Komponentmal</Form.Label>
                        <FormSelect onChange={(e) => setValgtVeiviser(e.target.value)}>
                            <option value="">Velg mal</option>
                            <option value="TekstKomponent">Tekst</option>
                            <option value="VarselKomponent">Varsel</option>
                            <option value="PieChartKomponent">Pie chart</option>
                            <option value="BarChartKomponent">Bar chart</option>
                            <option value="GrafanaKomponent">Grafana</option>
                            <option value="StackedAreaChartKomponent">Stacked area chart</option>
                            <option value="LineChartKomponent">Line chart</option>
                        </FormSelect>
                    </Form.Group>

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