import {useEffect, useState} from "react";
import {KontrollpanelKomponent} from "./KomponentKontrollpanel.tsx";
import {stompService} from "../../WebSocketService.tsx";

type GrafanaData = {
    receiver?: string | null;
    status?: string | null;
    alerts?: GrafanaAlert[] | null
};

type GrafanaAlert = {
    status?: string | null;
    labels?: GrafanaLabels | null
};
type GrafanaLabels = {
    alertname?: string | null;
    grafana_folder?: string | null
};

const AktiveVarsler = ({grafanadata}: { grafanadata: GrafanaData[] }) => {
    const varsler = grafanadata.flatMap(it => it.alerts ?? [])
    if (varsler.length === 0) {
        return <p>Ingen aktive varsler</p>
    }
    return (
        <ul className="list-unstyled mb-0">
            {varsler.map((alert, i) => (
                <li key={`${alert.labels?.grafana_folder ?? ""}_${alert.labels?.alertname ?? ""}_${i}`}>
                    🔥 {alert.labels?.alertname ?? "Ukjent varsel"}
                </li>
            ))}
        </ul>
    )
}

const GrafanaKomponent: React.FC<KontrollpanelKomponent> = ({data, komponentUUID}: KontrollpanelKomponent) => {
    const [grafanadata, setGrafanadata] = useState<GrafanaData[]>();

    const handleEvent = (grafanadata: GrafanaData[]): void => {
        setGrafanadata(grafanadata);
    };

    useEffect(() => {
        const parsedata = JSON.parse(data) as GrafanaData[]
        setGrafanadata(parsedata)
        const topic = `/komponent/${komponentUUID}/data`;
        const subscription = stompService.subscribe<GrafanaData[]>(topic, handleEvent);

        return () => {
            if (subscription) {
                stompService.unsubscribe(topic, subscription);
            }
        };
    }, []);

    if (!grafanadata) {
        return <p>Ingen data</p>
    }

    return <AktiveVarsler grafanadata={grafanadata}/>

}

export const RedigerGrafanaKomponent: React.FC<KontrollpanelKomponent> = ({data}: KontrollpanelKomponent) => {
    const [grafanadata, setGrafanadata] = useState<GrafanaData[]>();


    useEffect(() => {
        const parsedata = JSON.parse(data) as GrafanaData[]
        setGrafanadata(parsedata)
    }, []);

    if (!grafanadata) {
        return <p>Ingen data</p>
    }

    return <AktiveVarsler grafanadata={grafanadata}/>
}

export default GrafanaKomponent;