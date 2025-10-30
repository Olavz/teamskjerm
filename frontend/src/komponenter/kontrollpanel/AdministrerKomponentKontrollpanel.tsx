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
    const [skjulVarselEtterMinutterUtenFeil, setSkjulVarselEtterMinutterUtenFeil] = useState(0)
    const [lagreknappDeaktivert, setLagreknappDeaktivert] = useState(false)


    const oppdaterKomponent = async () => {
        setLagreknappDeaktivert(true)
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
                    utdatertKomponentEtterMinutter: utdatertKomponentEtterMinutter,
                    skjulVarselEtterMinutterUtenFeil: skjulVarselEtterMinutterUtenFeil
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send data');
            }

            setTimeout(() => {
                setLagreknappDeaktivert(false)
            }, 400)

        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        setInpNavn(kontrollpanelKomponent.navn)
        setInpSeMerInformasjon(kontrollpanelKomponent.seMerInformasjon ?? "")
        setUtdatertKomponentEtterMinutter(kontrollpanelKomponent.utdatertKomponentEtterMinutter ?? 0)
        setSkjulVarselEtterMinutterUtenFeil(kontrollpanelKomponent.skjulVarselEtterMinutterUtenFeil ?? 0)
    }, []);

    const getBaseUrl = () => {
        const {protocol, host} = window.location;
        return `${protocol}//${host}`;
    };

    return (
        <div className="col" key={kontrollpanelKomponent.komponentUUID}>
            <div className="card">
                <div className="card-body">
                    <form>
                        <FormGroup className="mb-3">
                            <FormLabel>Komponent type</FormLabel>
                            <FormControl
                                type="text"
                                disabled
                                value={kontrollpanelKomponent.komponentType}
                                aria-label="Komponenttype"
                            />
                        </FormGroup>

                        <FormGroup className="mb-3">
                            <FormLabel>Navn</FormLabel>
                            <FormControl
                                onChange={(e) => setInpNavn(e.target.value)}
                                type="text"
                                value={inpNavn}
                                placeholder="Skriv inn navn"
                                aria-label="Navn"
                            />
                        </FormGroup>

                        <FormGroup className="mb-3">
                            <FormLabel>Se mer informasjon lenke</FormLabel>
                            <FormControl
                                onChange={(e) => setInpSeMerInformasjon(e.target.value)}
                                type="url"
                                placeholder="http://..."
                                value={inpSeMerInformasjon}
                                aria-label="Se mer informasjon lenke"
                            />
                        </FormGroup>

                        <FormGroup className="mb-4">
                            <FormLabel>
                                Sett komponent utdatert etter minutter uten oppdatering (0 for deaktivering)
                            </FormLabel>
                            <FormControl
                                onChange={(e) => setUtdatertKomponentEtterMinutter(Number.parseInt(e.target.value))}
                                type="number"
                                min={0}
                                placeholder="0"
                                value={utdatertKomponentEtterMinutter}
                                aria-label="Utdatert etter minutter"
                            />
                        </FormGroup>

                        {kontrollpanelKomponent.komponentType === "VarselKomponent" &&
                            <FormGroup className="mb-4">
                                <FormLabel>
                                    Sett komponent minimering etter minutter med grønt varsel (0 for deaktivering)
                                </FormLabel>
                                <FormControl
                                    onChange={(e) => setSkjulVarselEtterMinutterUtenFeil(Number.parseInt(e.target.value))}
                                    type="number"
                                    min={0}
                                    placeholder="0"
                                    value={skjulVarselEtterMinutterUtenFeil}
                                    aria-label="Minimer etter minutter"
                                />
                            </FormGroup>
                        }

                        <div className="d-flex justify-content-end mb-4">
                            <Button
                                onClick={() => slettKomponent(kontrollpanelKomponent.komponentUUID)}
                                variant="danger"
                                className="me-2"
                            >
                                Slett
                            </Button>
                            <Button disabled={lagreknappDeaktivert} onClick={oppdaterKomponent} variant="primary">
                                Lagre
                            </Button>
                        </div>
                    </form>

                    <Accordion defaultActiveKey={null} className="mb-3">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Oppdater komponent</Accordion.Header>
                            <Accordion.Body>
                                <KomponentKontrollpanel
                                    kontrollpanelKomponent={kontrollpanelKomponent}
                                    komponentlayout={{visning: "innhold"}}
                                    setKomponentSistEndret={() => {
                                    }}
                                    oppdaterKomponentData={() => {
                                    }}
                                >
                                    {children}
                                </KomponentKontrollpanel>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Accordion defaultActiveKey={null}>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Endepunkt</Accordion.Header>
                            <Accordion.Body>
                                <div className="d-flex align-items-center">
                                    <Badge className="me-2 fs-5">PUT</Badge>
                                    <FormControl
                                        type="text"
                                        className="bg-light p-3 rounded mb-0 flex-grow-1 text-monospace"
                                        value={`${getBaseUrl()}/api/ext/komponent/${kontrollpanelKomponent.komponentUUID}/${kontrollpanelKomponent.secret}/${kontrollpanelKomponent.secretHashKey}`}
                                        readOnly
                                        aria-label="Endepunkt URL"
                                        style={{minWidth: 0}}
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        className="ms-2"
                                        onClick={() => {
                                            if (navigator.clipboard && navigator.clipboard.writeText) {
                                                navigator.clipboard.writeText(
                                                    `${getBaseUrl()}/api/ext/komponent/${kontrollpanelKomponent.komponentUUID}/${kontrollpanelKomponent.secret}/${kontrollpanelKomponent.secretHashKey}`
                                                );
                                            } else {
                                                alert("Kopiering til utklippstavle støttes ikke i denne nettleseren.");
                                            }
                                        }}
                                        aria-label="Kopier URL"
                                        title="Kopier URL til utklippstavlen"
                                    >
                                        Kopier
                                    </Button>
                                </div>
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