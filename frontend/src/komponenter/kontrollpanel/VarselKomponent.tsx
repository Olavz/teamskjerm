import {useEffect, useState} from "react";
import {stompService} from "../../WebSocketService.tsx";

type VarselData = {
    varseltype: "grønnt" | "gult" | "rødt";
    tekst: string;
};

type MessageProp = {
    komponentUUID: string
    komponentData: string
}

const VarselKomponent: React.FC<MessageProp> = ({komponentData, komponentUUID}: MessageProp) => {
    const [data, setData] = useState<VarselData>();

    const handleEvent = (varseldata: VarselData): void => {
        setData(varseldata);
    };

    useEffect(() => {
        let data = JSON.parse(komponentData) as VarselData
        setData(data)
        const topic = `/komponent/${komponentUUID}`;
        const subscription = stompService.subscribe<VarselData>(topic, handleEvent);

        return () => {
            if (subscription) {
                stompService.unsubscribe(topic, subscription);
            }
        };
    }, []);

    if(!data) {
        return <p>Noe gikk galt ved lasting av komponentdata</p>
    }

    if (data.varseltype == "rødt") {
        return (
            <div className="alert alert-danger" role="alert">
                {data.tekst ?? ""}
            </div>
        )
    } else if (data.varseltype == "gult") {
        return (
            <div className="alert alert-warning" role="alert">
                {data.tekst ?? ""}
            </div>
        )
    } else {
        return (
            <div className="alert alert-success" role="alert">
                {data.tekst ?? ""}
            </div>
        )
    }
}

export default VarselKomponent;