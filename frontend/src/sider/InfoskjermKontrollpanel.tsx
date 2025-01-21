import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import HeaderKontrollpanel from "../komponenter/kontrollpanel/HeaderKontrollpanel.tsx";
import {KomponentKontrollpanel, KontrollpanelKomponent} from "../komponenter/kontrollpanel/KomponentKontrollpanel.tsx";
import {stompService} from "../WebSocketService.tsx";
import PieChartKomponent from "../komponenter/kontrollpanel/PieChatKomponent.tsx";
import TekstKomponent from "../komponenter/kontrollpanel/TekstKomponent.tsx";
import VarselKomponent from "../komponenter/kontrollpanel/VarselKomponent.tsx";


type KontrollpanelParams = {
    kontrollpanelUUID: string;
};

function InfoskjermKontrollpanel() {
    const [data, setData] = useState<KontrollpanelKomponent[]>([]);
    const {kontrollpanelUUID} = useParams<KontrollpanelParams>();

    if (!kontrollpanelUUID) {
        return <p>Ingen ID spesifisert!</p>;
    }

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
        fetch(`/api/ext/kontrollpanel/${kontrollpanelUUID}/komponenter`)
            .then((response) => response.json())
            .then((data: KontrollpanelKomponent[]) => setData(data));
    }, []);

    let adminside = `/administrer/kontrollpanel/${kontrollpanelUUID}`

    const pairs = [];
    for (let i = 0; i < data.length; i += 3) {
        pairs.push(data.slice(i, i + 3));
    }

    return (
        <>
            <div>
                <HeaderKontrollpanel></HeaderKontrollpanel>
                <Link to={adminside}>Admin</Link>
                <div className="bittelittepadding">
                    {pairs.map((pair, rowIndex) => (
                        <div className="row" key={rowIndex}>
                            {pair.map((item) => (
                                <div className="col" key={item.komponentUUID}>
                                    <KomponentKontrollpanel kontrollpanelKomponent={item}>
                                        {utledKomponentType(item)}
                                    </KomponentKontrollpanel>
                                </div>
                            ))}
                        </div>
                    ))}
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
