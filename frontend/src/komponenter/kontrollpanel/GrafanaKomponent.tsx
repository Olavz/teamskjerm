import {useEffect, useState} from "react";
import {KontrollpanelKomponent} from "./KomponentKontrollpanel.tsx";
import {stompService} from "../../WebSocketService.tsx";

type GrafanaData = {
    receiver: string;
    status: string;
    alerts: GrafanaAlert[]
};

type GrafanaAlert = {
    status: string;
    labels: GrafanaLabels
};
type GrafanaLabels = {
    alertname: string;
    grafana_folder: string
};

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

    return (
        <>
            <p>{grafanadata.map(it => it.alerts[0].labels.alertname)}</p>
        </>
    )

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

    return (
        <>
            <p>{grafanadata.map(it => it.alerts[0].labels.alertname)}</p>
        </>
    )
}

export default GrafanaKomponent;