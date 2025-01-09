import {createContext, ReactNode, useEffect, useState} from "react";
import SockJS from "sockjs-client";
import {Client, IMessage} from "@stomp/stompjs";

type BaseKomponentKontrollpanelProps = {
    navn: string
    children: ReactNode
}

type KomponentKonfigurasjon = {
    kontrollpanelId: string,
    komponentId: string
}

// Context for data
export const DataContext = createContext<{
    komponentKonfigurasjon: KomponentKonfigurasjon,
    komponentData: any;
    loading: boolean
}>({komponentKonfigurasjon: {kontrollpanelId: "", komponentId: ""}, komponentData: null, loading: true});

export const DataProvider: React.FC<{
    kontrollpanelId: string,
    komponentId: string,
    children: React.ReactNode
}> = ({kontrollpanelId, komponentId, children}) => {
    const [komponentKonfigurasjon, setKomponentKonfigurasjon] = useState<KomponentKonfigurasjon>({
        kontrollpanelId: "",
        komponentId: ""
    });
    const [komponentData, setKomponentData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setKomponentKonfigurasjon(
            {
                kontrollpanelId: kontrollpanelId,
                komponentId: komponentId
            }
        )
    }, []);

    useEffect(() => {
        // Last inn initiellt via REST
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/kontrollpanel/${kontrollpanelId}/komponent/${komponentId}/data`);
                const result = await response.json();
                setKomponentData(result.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Opprett SockJS WebSocket-forbindelse
        const currentPort = window.location.port;
        const backendPort = currentPort === "5173" ? "8080" : currentPort;
        const baseUrl = `${window.location.protocol}//${window.location.hostname}:${backendPort}`;
        const socket = new SockJS(`${baseUrl}/ws`);

        let reconnectTimeout: number | null = null;

        const kobleTil = () => {

            const client = new Client({
                webSocketFactory: () => socket as WebSocket, // Bruk SockJS som WebSocket
                // debug: (str) => console.log(str),
                onConnect: () => {
                    console.log("Connected to WebSocket");

                    // Abonner på meldinger fra serveren
                    // client.subscribe(`/kontrollpanel/${kontrollpanelId}/komponent/${komponentId}`, (message: IMessage) => {
                    client.subscribe(`/kontrollpanel/${kontrollpanelId}/komponent/${komponentId}`, (message: IMessage) => {
                        setKomponentData(() => message.body);
                    });
                },
                onStompError: (e) => {
                    console.log("We have an onStompError", e)
                },
                onWebSocketError: (e) => {
                    console.log("We have an onWebSocketError", e)
                },
                onWebSocketClose: (e) => {
                    console.log("We have an onWebSocketClose", e)
                    scheduleReconnect()
                },
                onDisconnect: () => {
                    console.log("Disconnected from WebSocket");
                },
            });

            client.activate(); // Aktiver STOMP-klienten

            // Rengjøring når komponenten demonteres
            return () => {
                if (reconnectTimeout) {
                    clearTimeout(reconnectTimeout);
                }
                client.deactivate();
            };
        };

        const scheduleReconnect = () => {
            if (!reconnectTimeout) {
                reconnectTimeout = setTimeout(() => {
                    console.log('Attempting to reconnect...');
                    kobleTil();
                }, 5000);
            }
        };

        kobleTil()

    }, []);

    return <DataContext.Provider
        value={{komponentKonfigurasjon, komponentData, loading}}>{children}</DataContext.Provider>;
};

export const BaseKomponentKontrollpanel: React.FC<BaseKomponentKontrollpanelProps> = ({navn, children}) => {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{navn}</h5>
                {children}
            </div>
        </div>
    )
}