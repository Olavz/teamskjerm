import {KomponentKontrollpanel, KontrollpanelKomponent} from "./KomponentKontrollpanel.tsx";
import {ReactNode, useEffect, useState} from "react";
import {Accordion, Badge, Button, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import {teamskjermTokenCookie} from "../../CookieHjelper.tsx";
import {useNavigate} from "react-router-dom";

type BaseKomponentKontrollpanelProps = {
    kontrollpanelKomponent: KontrollpanelKomponent
    slettKomponent: (komponentUUID: string) => void
    children: ReactNode
}

export const AdministrerBaseKomponentKontrollpanel: React.FC<BaseKomponentKontrollpanelProps> = ({
                                                                                                     slettKomponent,
                                                                                                     kontrollpanelKomponent,
                                                                                                     children
                                                                                                 }) => {

    const [inpSeMerInformasjon, setInpSeMerInformasjon] = useState<string>('')
    const [inpNavn, setInpNavn] = useState<string>('')


    const oppdaterKomponent = async () => {
        const navigate = useNavigate();
        try {
            const response = await fetch(`/api/komponent/${kontrollpanelKomponent.komponentUUID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${teamskjermTokenCookie()}`,
                },
                body: JSON.stringify({
                    navn: inpNavn,
                    seMerInformasjon: inpSeMerInformasjon
                }),
            });

            if(response.status == 403) {
                navigate("/logginn")
            }

            if (!response.ok) {
                throw new Error('Failed to send data');
            }

            // const result = await response.json();
            // console.log('Success:', result);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        setInpNavn(kontrollpanelKomponent.navn)
        setInpSeMerInformasjon(kontrollpanelKomponent.seMerInformasjon ?? "")
    }, []);

    const getBaseUrl = () => {
        const {protocol, host} = window.location;
        return `${protocol}//${host}`;
    };

    return (
        <div className="col" key={kontrollpanelKomponent.komponentUUID}>
            <div className="card">
                <div className="card-body">
                    KomponentType: <Badge>{kontrollpanelKomponent.komponentType}</Badge>

                    <FormGroup>
                        <FormLabel>
                            Navn
                        </FormLabel>
                        <FormControl onChange={(e) => setInpNavn(e.target.value)} type="text"
                                     value={inpNavn}></FormControl>
                    </FormGroup>

                    <KomponentKontrollpanel kontrollpanelKomponent={kontrollpanelKomponent}>
                        {children}
                    </KomponentKontrollpanel>

                    <FormGroup>
                        <FormLabel>
                            Se mer informasjon lenke
                        </FormLabel>
                        <FormControl onChange={(e) => setInpSeMerInformasjon(e.target.value)} type="text"
                                     placeholder="http://..." value={inpSeMerInformasjon}></FormControl>
                    </FormGroup>

                    <hr/>

                    <Button onClick={() => slettKomponent(kontrollpanelKomponent.komponentUUID)}
                            variant="danger">Slett</Button> {' '}
                    <Button onClick={oppdaterKomponent}>Oppdater</Button>

<hr/>

                    <Accordion defaultActiveKey={null}>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Endepunkt</Accordion.Header>
                            <Accordion.Body>
                                <pre className="bg-light p-3 rounded">
                                    <code className="text-monospace">
                                        {getBaseUrl()}/api/komponent/{kontrollpanelKomponent.komponentUUID}/data
                                    </code>
                                </pre>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>JSON skjema</Accordion.Header>
                            <Accordion.Body>
                                <pre className="bg-light p-3 rounded">
                                    <code className="text-monospace">
                                        {kontrollpanelKomponent.jsonSkjema}
                                    </code>
                                </pre>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                </div>
            </div>
        </div>
    )
}