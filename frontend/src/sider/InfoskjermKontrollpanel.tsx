import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import HeaderKontrollpanel from "../komponenter/kontrollpanel/HeaderKontrollpanel.tsx";
import {
    KomponentKontrollpanel,
    KontrollpanelKomponent
} from "../komponenter/kontrollpanel/KomponentKontrollpanel.tsx";
import {stompService} from "../WebSocketService.tsx";
import PieChartKomponent from "../komponenter/kontrollpanel/PieChatKomponent.tsx";
import TekstKomponent from "../komponenter/kontrollpanel/TekstKomponent.tsx";
import VarselKomponent from "../komponenter/kontrollpanel/VarselKomponent.tsx";
import BarChartKomponent from "../komponenter/kontrollpanel/BarChatKomponent.tsx";
import GrafanaKomponent from "../komponenter/kontrollpanel/GrafanaKomponent.tsx";
import {
    KomponentRekkefølge,
    KontrollpanelKomponentPlassering
} from "./administrerkontrollpanel/AdministrerKontrollpanel.tsx";

type KontrollpanelParams = {
    kontrollpanelUUID: string;
};

export type Komponentlayout = {
    visning: "ingen" | "minimal" | "full" | "innhold";
};

function InfoskjermKontrollpanel() {
    const [kontrollpanelKomponent, setKontrollpanelKomponent] = useState<KontrollpanelKomponent[]>([]);
    const {kontrollpanelUUID} = useParams<KontrollpanelParams>();

    const [komponenterVenstre, setKomponenterVenstre] = useState<KomponentRekkefølge[]>([]);
    const [komponenterMidten, setKomponenterMidten] = useState<KomponentRekkefølge[]>([]);
    const [komponenterHøyre, setKomponenterHøyre] = useState<KomponentRekkefølge[]>([]);

    const [komponentlayoutMap, setKomponentlayoutMap] = useState<Record<string, Komponentlayout>>({});
    const setKomponentlayout = (komponentUUID: string, komponentlayout: Komponentlayout) => {
        setKomponentlayoutMap(prev => ({
            ...prev,
            [komponentUUID]: komponentlayout
        }));
    };
    const [komponentSistEndretMap, setKomponentSistEndretMap] = useState<Record<string, Date>>({});
    const setKomponentSistEndret = (komponentUUID: string, komponentSistEndret: Date) => {
        setKomponentSistEndretMap(prev => ({
            ...prev,
            [komponentUUID]: komponentSistEndret
        }));
    };

    function oppdaterDataForKomponent(komponentId: string, data: string): void {
        setKontrollpanelKomponent(prev =>
            prev.map(item =>
                item.komponentUUID === komponentId
                    ? { ...item, data: data }
                    : item
            )
        );
    }

    const handleEvent = (): void => {
        location.reload() // TODO: Altså, ja, gjør jobben er konklusjon. #react4life
    };

    useEffect(() => {
        // Opprett SockJS WebSocket-forbindelse
        const currentPort = window.location.port;
        const backendPort = currentPort === "5173" ? "8080" : currentPort;
        const baseUrl = `${window.location.protocol}//${window.location.hostname}:${backendPort}`;

        stompService.connect(`${baseUrl}/ws`);

        const topic = `/kontrollpanel/${kontrollpanelUUID}`;
        stompService.subscribe(topic, handleEvent);

        return () => {
            stompService.client?.deactivate();
        };
    }, []);

    useEffect(() => {
        if (!kontrollpanelUUID) {
            return;
        }
        fetch(`/api/ext/kontrollpanel/${kontrollpanelUUID}/komponenter`)
            .then((response) => response.json())
            .then((data: KontrollpanelKomponent[]) => setKontrollpanelKomponent(data));

        fetch(`/api/ext/kontrollpanel/${kontrollpanelUUID}/komponentPlassering`)
            .then((response) => response.json())
            .then((data: KontrollpanelKomponentPlassering) => {
                setKomponenterVenstre(data.venstre)
                setKomponenterMidten(data.midten)
                setKomponenterHøyre(data.høyre)
            });
    }, []);

    if (!kontrollpanelUUID) {
        return <p>Ingen ID spesifisert!</p>;
    }

    if (!komponenterVenstre || !komponenterMidten || !komponenterHøyre) {
        return <p>laster...</p>;
    }

    return (
        <>
            <div>
                <HeaderKontrollpanel/>
                <div className="bittelittepadding">
                    <div className="row">
                        <div className="col p-0">
                            {komponenterVenstre.map(venstre => {
                                const item = kontrollpanelKomponent.find(it => it.komponentUUID === venstre.komponentUUID);
                                return item && (
                                    <div className="komponentkort" key={item.komponentUUID}>
                                        <KomponentKontrollpanel
                                            kontrollpanelKomponent={item}
                                            komponentlayout={komponentlayoutMap[item.komponentUUID] || { visning: "full" }}
                                            setKomponentSistEndret={(dato: Date) => setKomponentSistEndret(item.komponentUUID, dato)}
                                            oppdaterKomponentData={(data: string) => oppdaterDataForKomponent(item.komponentUUID, data)}
                                        >
                                            {utledKomponentType(
                                                item,
                                                komponentSistEndretMap[item.komponentUUID] ?? (item.sistOppdatertMedDataDiff ? new Date(item.sistOppdatertMedDataDiff) : new Date(item.sistOppdatert!)),
                                                komponentlayoutMap[item.komponentUUID] ?? { visning: "full" },
                                                (komponentlayout: Komponentlayout) => setKomponentlayout(item.komponentUUID, komponentlayout)
                                            )}
                                        </KomponentKontrollpanel>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="col p-0">
                            {komponenterMidten.map(midten => {
                                const item = kontrollpanelKomponent.find(it => it.komponentUUID === midten.komponentUUID);
                                return item && (
                                    <div className="komponentkort" key={item.komponentUUID}>
                                        <KomponentKontrollpanel
                                            kontrollpanelKomponent={item}
                                            komponentlayout={komponentlayoutMap[item.komponentUUID] || { visning: "full" }}
                                            setKomponentSistEndret={(dato: Date) => setKomponentSistEndret(item.komponentUUID, dato)}
                                            oppdaterKomponentData={(data: string) => oppdaterDataForKomponent(item.komponentUUID, data)}
                                        >
                                            {utledKomponentType(
                                                item,
                                                komponentSistEndretMap[item.komponentUUID] ?? (item.sistOppdatertMedDataDiff ? new Date(item.sistOppdatertMedDataDiff) : new Date()),
                                                komponentlayoutMap[item.komponentUUID] ?? { visning: "full" },
                                                (komponentlayout) => setKomponentlayout(item.komponentUUID, komponentlayout))
                                            }
                                        </KomponentKontrollpanel>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="col p-0">
                            {komponenterHøyre.map(høyre => {
                                const item = kontrollpanelKomponent.find(it => it.komponentUUID === høyre.komponentUUID);
                                return item && (
                                    <div className="komponentkort" key={item.komponentUUID}>
                                        <KomponentKontrollpanel
                                            kontrollpanelKomponent={item}
                                            komponentlayout={komponentlayoutMap[item.komponentUUID] || { visning: "full" }}
                                            setKomponentSistEndret={(dato: Date) => setKomponentSistEndret(item.komponentUUID, dato)}
                                            oppdaterKomponentData={(data: string) => oppdaterDataForKomponent(item.komponentUUID, data)}
                                        >
                                            {utledKomponentType(
                                                item,
                                                komponentSistEndretMap[item.komponentUUID] ?? (item.sistOppdatertMedDataDiff ? new Date(item.sistOppdatertMedDataDiff) : new Date()),
                                                komponentlayoutMap[item.komponentUUID] ?? { visning: "full" },
                                                (komponentlayout) => setKomponentlayout(item.komponentUUID, komponentlayout))
                                            }
                                        </KomponentKontrollpanel>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const utledKomponentType = (
    item: KontrollpanelKomponent,
    sistEndret: Date,
    komponentlayout: Komponentlayout,
    setKomponentlayout: (komponentlayout: Komponentlayout) => void
) => {
    switch (item.komponentType) {
        case 'TekstKomponent':
            return (
                <TekstKomponent {...item} />
            )
        case 'VarselKomponent':
            return (
                <VarselKomponent
                    {...item}
                    sistEndret={sistEndret}
                    komponentlayout={komponentlayout}
                    setKomponentlayout={setKomponentlayout}
                />
            )
        case 'PieChartKomponent':
            return (
                <PieChartKomponent {...item} />
            )
        case 'BarChartKomponent':
            return (
                <BarChartKomponent {...item} />
            )
        case 'GrafanaKomponent':
            return (
                <GrafanaKomponent {...item} />
            )
        default:
            throw new Error("Støtter ikke " + item.komponentType)
    }
}

export default InfoskjermKontrollpanel
