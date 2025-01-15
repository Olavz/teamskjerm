import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import HeaderKontrollpanel from "../komponenter/kontrollpanel/HeaderKontrollpanel.tsx";
import TekstKomponent from "../komponenter/kontrollpanel/TekstKomponent.tsx";
import {KomponentKontrollpanel} from "../komponenter/kontrollpanel/KomponentKontrollpanel.tsx";
import VarselKomponent from "../komponenter/kontrollpanel/VarselKomponent.tsx";
import {stompService} from "../WebSocketService.tsx";


interface KontrollpanelKomponent {
    komponentUUID: string;
    navn: string;
    data: string;
    komponentType: string;
}

type KontrollpanelParams = {
    kontrollpanelId: string;
};

function InfoskjermKontrollpanel() {
    const [data, setData] = useState<KontrollpanelKomponent[]>([]);
    const {kontrollpanelId} = useParams<KontrollpanelParams>();

    if (!kontrollpanelId) {
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
        fetch(`/api/kontrollpanel/${kontrollpanelId}/komponenter`)
            .then((response) => response.json())
            .then((data: KontrollpanelKomponent[]) => setData(data));
    }, []);

    let adminside = `/administrer/kontrollpanel/${kontrollpanelId}`

    return (
        <>
            <div>
                <HeaderKontrollpanel></HeaderKontrollpanel>
                <Link to={adminside}>Admin</Link>
                <div className="container">
                    <div className="row">
                        {data.map((item) => {
                            if (item.komponentType == "TekstKomponent") {
                                return (
                                    <div className="col" key={item.komponentUUID}>
                                        <KomponentKontrollpanel kontrollpanelKomponent={item}>
                                            <TekstKomponent
                                                komponentUUID={item.komponentUUID}
                                                komponentData={item.data}
                                            />
                                        </KomponentKontrollpanel>
                                    </div>
                                )
                            } else if (item.komponentType == "VarselKomponent") {
                                return (
                                    <div className="col" key={item.komponentUUID}>
                                        <KomponentKontrollpanel kontrollpanelKomponent={item}>
                                            <VarselKomponent
                                                komponentUUID={item.komponentUUID}
                                                komponentData={item.data}
                                            />
                                        </KomponentKontrollpanel>
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default InfoskjermKontrollpanel
