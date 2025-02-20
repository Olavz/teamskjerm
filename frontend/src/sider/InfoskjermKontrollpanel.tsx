import {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import HeaderKontrollpanel from "../komponenter/kontrollpanel/HeaderKontrollpanel.tsx";
import {KomponentKontrollpanel, KontrollpanelKomponent} from "../komponenter/kontrollpanel/KomponentKontrollpanel.tsx";
import {stompService} from "../WebSocketService.tsx";
import PieChartKomponent from "../komponenter/kontrollpanel/PieChatKomponent.tsx";
import TekstKomponent from "../komponenter/kontrollpanel/TekstKomponent.tsx";
import VarselKomponent from "../komponenter/kontrollpanel/VarselKomponent.tsx";
import Masonry from "masonry-layout";

type KontrollpanelParams = {
    kontrollpanelUUID: string;
};

function InfoskjermKontrollpanel() {
    const gridRef = useRef<HTMLDivElement | null>(null);
    const [data, setData] = useState<KontrollpanelKomponent[]>([]);
    const {kontrollpanelUUID} = useParams<KontrollpanelParams>();

    useEffect(() => {
        // Opprett SockJS WebSocket-forbindelse
        const currentPort = window.location.port;
        const backendPort = currentPort === "5173" ? "8080" : currentPort;
        const baseUrl = `${window.location.protocol}//${window.location.hostname}:${backendPort}`;

        stompService.connect(`${baseUrl}/ws`);

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
            .then((data: KontrollpanelKomponent[]) => setData(data));
    }, []);

    useEffect(() => {
        if (gridRef.current) {
            setTimeout(() => {
                new Masonry(gridRef.current as Element, {
                    itemSelector: ".masonry-item",
                    percentPosition: true,
                    gutter: 0,
                });
            }, 1000);
        }
    }, []);


    if (!kontrollpanelUUID) {
        return <p>Ingen ID spesifisert!</p>;
    }

    return (
        <>
            <div>
                <HeaderKontrollpanel/>
                <div className="bittelittepadding">
                    <div className="row masonry-grid" ref={gridRef}>
                        {data.map((item) => (
                            <div className="col-md-4 masonry-item g-3" key={item.komponentUUID}>
                                <KomponentKontrollpanel kontrollpanelKomponent={item}>
                                    {utledKomponentType(item)}
                                </KomponentKontrollpanel>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

const utledKomponentType = (item: KontrollpanelKomponent) => {
    switch (item.komponentType) {
        case 'TekstKomponent':
            return (
                <TekstKomponent {...item} />
            )
        case 'VarselKomponent':
            return (
                <VarselKomponent {...item} />
            )
        case 'PieChartKomponent':
            return (
                <PieChartKomponent {...item} />
            )
        default:
            throw new Error("Støtter ikke " + item.komponentType)
    }
}

export default InfoskjermKontrollpanel
