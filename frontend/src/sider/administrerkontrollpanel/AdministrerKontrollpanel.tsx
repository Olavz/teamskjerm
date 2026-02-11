import {useEffect, useState} from "react";
import {NavLink, useParams} from "react-router-dom";
import {Button, ButtonGroup, Modal} from "react-bootstrap";

import {closestCenter, DndContext, DragEndEvent, DragOverlay, DragStartEvent} from "@dnd-kit/core";
import DroppableColumnComponent from "./DroppableColumnComponent.tsx";
import {DraggableKomponentKort} from "./DraggableKomponentKort.tsx";
import {arrayMove} from "@dnd-kit/sortable";
import {teamskjermTokenCookie} from "../../CookieHjelper.tsx";
import {KontrollpanelKomponent} from "../../komponenter/kontrollpanel/KomponentKontrollpanel.tsx";
import NavbarInnlogget from "../../komponenter/NavbarInnlogget.tsx";
import {LeggTilKomponentButton} from "../../komponenter/kontrollpanel/LeggTilKomponentButton.tsx";
import {
    AdministrerBaseKomponentKontrollpanel
} from "../../komponenter/kontrollpanel/AdministrerKomponentKontrollpanel.tsx";
import {RedigerTekstKomponent} from "../../komponenter/kontrollpanel/TekstKomponent.tsx";
import {RedigerVarselKomponent} from "../../komponenter/kontrollpanel/VarselKomponent.tsx";
import {RedigerPieChartKomponent} from "../../komponenter/kontrollpanel/PieChatKomponent.tsx";
import {RedigerBarChartKomponent} from "../../komponenter/kontrollpanel/BarChatKomponent.tsx";
import {RedigerGrafanaKomponent} from "../../komponenter/kontrollpanel/GrafanaKomponent.tsx";
import {RedigerStackedAreaChartKomponent} from "../../komponenter/kontrollpanel/StackedAreaChartKomponent.tsx";
import {RedigerLineChartKomponent} from "../../komponenter/kontrollpanel/LineChartKomponent.tsx";

export interface KontrollpanelKomponentPlassering {
    venstre: KomponentRekkefølge[];
    midten: KomponentRekkefølge[];
    høyre: KomponentRekkefølge[];
}

export interface KomponentRekkefølge {
    komponentUUID: string;
    rekkefølge: number;
}

export interface NyttKontrollpanel {
    id?: string;
    eierId?: string;
    navn: string;
    kontrollpanelUUID: string;
    komponenter?: string[];
}

type KontrollpanelParams = {
    kontrollpanelUUID: string;
};

function AdministrerKontrollpanel() {
    const [redigerKomponentvisning, setRedigerKomponentvisning] = useState(false);
    const [draggableAktivId, setDraggableAktivId] = useState<string | null>(null);

    const [komponentopprettet, setKomponentopprettet] = useState<number>(0);
    const [kontrollpanelKomponenter, setKontrollpanelKomponenter] = useState<KontrollpanelKomponent[]>([]);
    const {kontrollpanelUUID} = useParams<KontrollpanelParams>();

    const [komponenterVenstre, setKomponenterVenstre] = useState<KomponentRekkefølge[]>([]);
    const [komponenterMidten, setKomponenterMidten] = useState<KomponentRekkefølge[]>([]);
    const [komponenterHøyre, setKomponenterHøyre] = useState<KomponentRekkefølge[]>([]);

    const [komponenterUtenPlassering, setKomponenterUtenPlassering] = useState<KomponentRekkefølge[]>([]);

    const [visModal, setVisModal] = useState(false);
    const [valgtKomponentUUIDForModal, setValgtKomponentUUIDForModal] = useState("");
    const åpneModal = () => setVisModal(true);
    const lukkModal = () => setVisModal(false);

    if (!kontrollpanelUUID) {
        return <p>Ingen ID spesifisert!</p>;
    }

    useEffect(() => {
        fetch(`/api/kontrollpanel/${kontrollpanelUUID}/komponenter`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${teamskjermTokenCookie()}`
            }
        })
            .then((response) => {
                return response.json()
            })
            .then((data: KontrollpanelKomponent[]) => setKontrollpanelKomponenter(data));
    }, [komponentopprettet]);

    useEffect(() => {
        fetch(`/api/kontrollpanel/${kontrollpanelUUID}/komponentPlassering`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${teamskjermTokenCookie()}`
            }
        })
            .then((response) => {
                return response.json()
            })
            .then((data: KontrollpanelKomponentPlassering) => {
                setKomponenterVenstre(data.venstre)
                setKomponenterMidten(data.midten)
                setKomponenterHøyre(data.høyre)
            });

        fetch(`/api/kontrollpanel/${kontrollpanelUUID}/komponenterUtenPlassering`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${teamskjermTokenCookie()}`
            }
        })
            .then((response) => {
                return response.json()
            })
            .then((data: string[]) => {
                setKomponenterUtenPlassering(data.map(it => ({komponentUUID: it, rekkefølge: 0})))
            });
    }, []);

    const slettKomponent = async (komponentUUID: string) => {
        try {
            const response = await fetch(`/api/kontrollpanel/${kontrollpanelUUID}/komponent/${komponentUUID}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${teamskjermTokenCookie()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to send data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setKontrollpanelKomponenter(
            kontrollpanelKomponenter.filter((it) => it.komponentUUID != komponentUUID)
        )
    }

    const opprettKomponent = async (kontrollpanelUUID: string, kontrollpanelKomponent: KontrollpanelKomponent) => {

        try {
            const response = await fetch(`/api/kontrollpanel/${kontrollpanelUUID}/komponent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${teamskjermTokenCookie()}`
                },
                body: JSON.stringify(kontrollpanelKomponent),
            });

            if (!response.ok) {
                throw new Error('Failed to send data');
            }
            await response;
            setKomponentopprettet(komponentopprettet + 1)
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const oppdaterKontrollpanelKomponentPlassering = async (kontrollpanelUUID: string, kontrollpanelKomponentPlassering: KontrollpanelKomponentPlassering) => {

        try {
            const response = await fetch(`/api/kontrollpanel/${kontrollpanelUUID}/komponentPlassering`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${teamskjermTokenCookie()}`
                },
                body: JSON.stringify(kontrollpanelKomponentPlassering),
            });

            if (!response.ok) {
                throw new Error('Failed to send data');
            }
            await response;

        } catch (error) {
            console.error('Error:', error);
        }
    }

    if (komponenterVenstre == null) {
        return <div>laster..</div>
    }

    const finnKolonneFraKomponentUUID = (id: string): KolonneId | undefined => {
        if (komponenterVenstre.some(k => k.komponentUUID === id)) return "venstre";
        if (komponenterMidten.some(k => k.komponentUUID === id)) return "midten";
        if (komponenterHøyre.some(k => k.komponentUUID === id)) return "høyre";
        if (komponenterUtenPlassering.some(k => k.komponentUUID === id)) return "ikkePlassert";
        return undefined;
    };

    const utledValgtKomponent = (id: string): KomponentRekkefølge | undefined => {
        return [...komponenterVenstre, ...komponenterMidten, ...komponenterHøyre, ...komponenterUtenPlassering].find(k => k.komponentUUID === id);
    };

    const handleDragStart = (event: DragStartEvent) => {
        setDraggableAktivId(event.active.id.toString())
    }

    type KolonneId = "ikkePlassert" | "venstre" | "midten" | "høyre";

    const handleDragEnd = (event: DragEndEvent) => {
        setDraggableAktivId(null);
        const {active, over} = event;

        if (!over) return;

        const draggedId = active.id as string;
        const overId = over.id as string;

        const sourceColumn = finnKolonneFraKomponentUUID(draggedId);
        const destinationColumn: KolonneId | undefined =
            ["ikkePlassert", "venstre", "midten", "høyre"].includes(overId)
                ? (overId as KolonneId)
                : finnKolonneFraKomponentUUID(overId);

        if (!sourceColumn || !destinationColumn) return;

        const kolonneMap: Record<KolonneId, [KomponentRekkefølge[], React.Dispatch<React.SetStateAction<KomponentRekkefølge[]>>]> = {
            ikkePlassert: [komponenterUtenPlassering, setKomponenterUtenPlassering],
            venstre: [komponenterVenstre, setKomponenterVenstre],
            midten: [komponenterMidten, setKomponenterMidten],
            høyre: [komponenterHøyre, setKomponenterHøyre],
        };

        const [sourceList, setSourceList] = kolonneMap[sourceColumn];
        const [, setDestinationList] = kolonneMap[destinationColumn];

        // Flytting innen samme kolonne
        if (sourceColumn === destinationColumn) {
            const oldIndex = sourceList.findIndex(k => k.komponentUUID === draggedId);
            const newIndex = sourceList.findIndex(k => k.komponentUUID === overId);

            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                const nyListe = arrayMove(sourceList, oldIndex, newIndex);
                setSourceList(nyListe);
            }

            return;
        }

        // Flytting mellom kolonner
        const valgtKomponent = utledValgtKomponent(draggedId);
        if (!valgtKomponent) return;

        // Fjern fra kilden
        setSourceList(prev => prev.filter(k => k.komponentUUID !== draggedId));
        // Legg til i målet
        setDestinationList(prev => [...prev, valgtKomponent]);
    };


    const infoskjerm = `/kontrollpanel/${kontrollpanelUUID}`

    function redigerVisningKlikk() {
        setRedigerKomponentvisning(!redigerKomponentvisning)

        // Er true i den redigering avsluttes
        if (redigerKomponentvisning) {

            const obj: KontrollpanelKomponentPlassering = {
                venstre: komponenterVenstre.map((komponent, index) => ({...komponent, rekkefølge: index})),
                midten: komponenterMidten.map((komponent, index) => ({...komponent, rekkefølge: index})),
                høyre: komponenterHøyre.map((komponent, index) => ({...komponent, rekkefølge: index}))
            }

            if (kontrollpanelUUID) {
                oppdaterKontrollpanelKomponentPlassering(kontrollpanelUUID, obj)
            }
        }
    }

    const visModalForKomponent = (komponentUUID: string) => {
        åpneModal()
        setValgtKomponentUUIDForModal(komponentUUID)
    }

    return (
        <>
            <NavbarInnlogget/>
            <div className="container">
                <div style={{marginTop: "1rem"}}>
                    <ButtonGroup>
                        <Button variant={redigerKomponentvisning ? "secondary" : "outline-secondary"}
                                onClick={redigerVisningKlikk}>
                            {redigerKomponentvisning ? "✅ Avslutt redigering" : "🖱 Aktiver redigering"}
                        </Button> {' '}
                        <LeggTilKomponentButton opprettKomponent={opprettKomponent}/>
                    </ButtonGroup>
                    {' '}
                    <NavLink target="_blank" to={infoskjerm}><Button variant="outline-secondary">🖥 Vis
                        teamskjerm</Button></NavLink>
                </div>

                {redigerKomponentvisning && <><br/>
                    <div className="alert alert-warning" role="alert">Dra og slipp komponenter for å endre plassering.
                        Husk å klikke "Avslutt redigering" for å lagre plasseringen.
                    </div>
                </>}

                <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    onDragStart={handleDragStart}
                >

                    <div style={{display: "flex", gap: "1rem", padding: "1rem"}}>
                        <DroppableColumnComponent
                            id="ikkePlassert"
                            key="ikkePlassert"
                            tittel="Ikke plassert"
                            kontrollpanelKomponenter={kontrollpanelKomponenter}
                            komponenterRekkefølge={komponenterUtenPlassering}
                            redigerVisning={redigerKomponentvisning}
                            visModalForKomponent={visModalForKomponent}
                        />

                        <DroppableColumnComponent
                            id="venstre"
                            key="venstre"
                            kontrollpanelKomponenter={kontrollpanelKomponenter}
                            komponenterRekkefølge={komponenterVenstre}
                            redigerVisning={redigerKomponentvisning}
                            visModalForKomponent={visModalForKomponent}
                        />
                        <DroppableColumnComponent
                            id="midten"
                            key="midten"
                            kontrollpanelKomponenter={kontrollpanelKomponenter}
                            komponenterRekkefølge={komponenterMidten}
                            redigerVisning={redigerKomponentvisning}
                            visModalForKomponent={visModalForKomponent}
                        />
                        <DroppableColumnComponent
                            id="høyre"
                            key="høyre"
                            kontrollpanelKomponenter={kontrollpanelKomponenter}
                            komponenterRekkefølge={komponenterHøyre}
                            redigerVisning={redigerKomponentvisning}
                            visModalForKomponent={visModalForKomponent}
                        />
                    </div>
                    <DragOverlay>
                        {draggableAktivId ?
                            <DraggableKomponentKort
                                komponent={kontrollpanelKomponenter.find((it) => it.komponentUUID === draggableAktivId)!}
                                key={draggableAktivId}
                                id={draggableAktivId}
                                redigerVisning={redigerKomponentvisning}
                                visModalForKomponent={visModalForKomponent}
                            /> : null}
                    </DragOverlay>
                </DndContext>

                <Modal
                    show={visModal}
                    onHide={lukkModal}
                    size="lg" // Alternativ: xl, eller bruk fullscreen
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Komponent alternativer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container">
                            {kontrollpanelKomponenter.filter(it => it.komponentUUID === valgtKomponentUUIDForModal).map((item) => {
                                if (item.komponentType == "TekstKomponent") {
                                    return (
                                        <div className="row" key={item.komponentUUID}>
                                            <AdministrerBaseKomponentKontrollpanel slettKomponent={slettKomponent}
                                                                                   kontrollpanelKomponent={item}>
                                                <RedigerTekstKomponent  {...item}/>
                                            </AdministrerBaseKomponentKontrollpanel>
                                        </div>
                                    )
                                } else if (item.komponentType == "VarselKomponent") {
                                    return (
                                        <div className="row" key={item.komponentUUID}>
                                            <AdministrerBaseKomponentKontrollpanel slettKomponent={slettKomponent}
                                                                                   kontrollpanelKomponent={item}>
                                                <RedigerVarselKomponent {...item} />
                                            </AdministrerBaseKomponentKontrollpanel>
                                        </div>
                                    )
                                } else if (item.komponentType == "PieChartKomponent") {
                                    return (
                                        <div className="row" key={item.komponentUUID}>
                                            <AdministrerBaseKomponentKontrollpanel slettKomponent={slettKomponent}
                                                                                   kontrollpanelKomponent={item}>
                                                <RedigerPieChartKomponent {...item} />
                                            </AdministrerBaseKomponentKontrollpanel>
                                        </div>
                                    )
                                } else if (item.komponentType == "BarChartKomponent") {
                                    return (
                                        <div className="row" key={item.komponentUUID}>
                                            <AdministrerBaseKomponentKontrollpanel slettKomponent={slettKomponent}
                                                                                   kontrollpanelKomponent={item}>
                                                <RedigerBarChartKomponent {...item} />
                                            </AdministrerBaseKomponentKontrollpanel>
                                        </div>
                                    )
                                } else if (item.komponentType == "GrafanaKomponent") {
                                    return (
                                        <div className="row" key={item.komponentUUID}>
                                            <AdministrerBaseKomponentKontrollpanel slettKomponent={slettKomponent}
                                                                                   kontrollpanelKomponent={item}>
                                                <RedigerGrafanaKomponent {...item} />
                                            </AdministrerBaseKomponentKontrollpanel>
                                        </div>
                                    )
                                } else if (item.komponentType == "StackedAreaChartKomponent") {
                                    return (
                                        <div className="row" key={item.komponentUUID}>
                                            <AdministrerBaseKomponentKontrollpanel slettKomponent={slettKomponent}
                                                                                   kontrollpanelKomponent={item}>
                                                <RedigerStackedAreaChartKomponent {...item} />
                                            </AdministrerBaseKomponentKontrollpanel>
                                        </div>
                                    )
                                } else if (item.komponentType == "LineChartKomponent") {
                                    return (
                                        <div className="row" key={item.komponentUUID}>
                                            <AdministrerBaseKomponentKontrollpanel slettKomponent={slettKomponent}
                                                                                   kontrollpanelKomponent={item}>
                                                <RedigerLineChartKomponent {...item} />
                                            </AdministrerBaseKomponentKontrollpanel>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={lukkModal}>
                            Lukk
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        </>
    )
}

export default AdministrerKontrollpanel