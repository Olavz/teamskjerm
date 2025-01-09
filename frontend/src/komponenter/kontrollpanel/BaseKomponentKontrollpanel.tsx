import {createContext, ReactNode, useEffect, useState} from "react";
import SockJS from "sockjs-client";
import {Client, IMessage} from "@stomp/stompjs";

type BaseKomponentKontrollpanelProps = {
    navn: string
    children: ReactNode
}

// Context for data
export const DataContext = createContext<{ komponentData: any; loading: boolean }>({ komponentData: null, loading: true });

export const DataProvider: React.FC<{ url: string; subscriptionPath: string, children: React.ReactNode }> = ({ url, subscriptionPath, children }) => {
    const [komponentData, setKomponentData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(url);
                const result = await response.json();
                setKomponentData(result.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setLoading(false);
        };

        fetchData();
    }, [url]);

    useEffect(() => {
        // Opprett SockJS WebSocket-forbindelse
        const currentPort = window.location.port;
        const backendPort = currentPort === "5173" ? "8080" : currentPort;
        const baseUrl = `${window.location.protocol}//${window.location.hostname}:${backendPort}`;
        const socket = new SockJS(`${baseUrl}/ws`);

        const client = new Client({
            webSocketFactory: () => socket as WebSocket, // Bruk SockJS som WebSocket
            // debug: (str) => console.log(str),
            onConnect: () => {
                console.log("Connected to WebSocket");

                // Abonner på meldinger fra serveren
                // client.subscribe(`/kontrollpanel/${kontrollpanelId}/komponent/${komponentId}`, (message: IMessage) => {
                client.subscribe(`${subscriptionPath}`, (message: IMessage) => {
                    setKomponentData(() => message.body);
                });
            },
            onDisconnect: () => {
                console.log("Disconnected from WebSocket");
            },
        });

        client.activate(); // Aktiver STOMP-klienten

        // Rengjøring når komponenten demonteres
        return () => {
            client.deactivate();
        };
    }, []);

    return <DataContext.Provider value={{ komponentData, loading }}>{children}</DataContext.Provider>;
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