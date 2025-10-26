import {KomponentKontrollpanel, KontrollpanelKomponent} from "./KomponentKontrollpanel.tsx";
import {ReactNode, useEffect, useState} from "react";
import {Accordion, Badge, Button, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import {teamskjermTokenCookie} from "../../CookieHjelper.tsx";

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
    const [utdatertKomponentEtterMinutter, setUtdatertKomponentEtterMinutter] = useState(0)


    const oppdaterKomponent = async () => {
        try {
            const response = await fetch(`/api/komponent/${kontrollpanelKomponent.komponentUUID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${teamskjermTokenCookie()}`,
                },
                body: JSON.stringify({
                    navn: inpNavn,
                    seMerInformasjon: inpSeMerInformasjon,
                    utdatertKomponentEtterMinutter: utdatertKomponentEtterMinutter
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send data');
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        setInpNavn(kontrollpanelKomponent.navn)
        setInpSeMerInformasjon(kontrollpanelKomponent.seMerInformasjon ?? "")
        setUtdatertKomponentEtterMinutter(kontrollpanelKomponent.utdatertKomponentEtterMinutter ?? 0)
    }, []);

    const getBaseUrl = () => {
        const {protocol, host} = window.location;
        return `${protocol}//${host}`;
    };

    return (
        <div className="col" key={kontrollpanelKomponent.komponentUUID}>
            <div className="card">
                <div className="card-body">

                    <FormGroup>
                        <FormControl type="text" disabled={true} value={kontrollpanelKomponent.komponentType}></FormControl>
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>
                            Navn
                        </FormLabel>
                        <FormControl onChange={(e) => setInpNavn(e.target.value)} type="text"
                                     value={inpNavn}></FormControl>
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>
                            Se mer informasjon lenke
                        </FormLabel>
                        <FormControl onChange={(e) => setInpSeMerInformasjon(e.target.value)} type="text"
                                     placeholder="http://..." value={inpSeMerInformasjon}></FormControl>
                    </FormGroup>

                    <FormGroup>
                        <FormLabel>
                            Sett komponent utdatert etter minutter uten oppdatering (0 for deaktivering)
                        </FormLabel>
                        <FormControl onChange={(e) => setUtdatertKomponentEtterMinutter(Number.parseInt(e.target.value))} type="text"
                                     placeholder="0" value={utdatertKomponentEtterMinutter}></FormControl>
                    </FormGroup>

                    <hr/>

                    <Button onClick={() => slettKomponent(kontrollpanelKomponent.komponentUUID)}
                            variant="danger">Slett</Button> {' '}
                    <Button onClick={oppdaterKomponent}>Lagre</Button>

                    <hr/>

                    <Accordion defaultActiveKey={null}>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Data</Accordion.Header>
                            <Accordion.Body>
                                <KomponentKontrollpanel kontrollpanelKomponent={kontrollpanelKomponent}>
                                    {children}
                                </KomponentKontrollpanel>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>


                    <hr/>

                    <Accordion defaultActiveKey={null}>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Endepunkt</Accordion.Header>
                            <Accordion.Body>
                                <Badge>PUT</Badge>
                                <pre className="bg-light p-3 rounded">
                                    <code className="text-monospace">
                                        {getBaseUrl()}/api/ext/komponent/{kontrollpanelKomponent.komponentUUID}/{kontrollpanelKomponent.secret}/{kontrollpanelKomponent.secretHashKey}
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