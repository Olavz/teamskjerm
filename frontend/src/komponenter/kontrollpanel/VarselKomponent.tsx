import {useEffect, useState} from "react";
import {stompService} from "../../WebSocketService.tsx";
import {FormControl, FormSelect} from "react-bootstrap";
import {KontrollpanelKomponent} from "./KomponentKontrollpanel.tsx";
import {Komponentlayout} from "../../sider/InfoskjermKontrollpanel.tsx";

type VarselData = {
    varseltype: "grønt" | "gult" | "rødt";
    tekst: string;
};

type VarselKomponentProps = KontrollpanelKomponent & {
    skjulVarselEtterMinutterUtenFeil?: number;
    sistEndret: Date;
    komponentlayout: Komponentlayout;
    setKomponentlayout: (komponentlayout: Komponentlayout) => void;
};

const VarselKomponent: React.FC<VarselKomponentProps> = ({
                                                             data,
                                                             komponentUUID,
                                                             komponentlayout,
                                                             setKomponentlayout,
                                                             skjulVarselEtterMinutterUtenFeil,
                                                             sistEndret
                                                         }) => {
    const [varseldata, setVarseldata] = useState<VarselData>();

    const handleEvent = (varseldata: VarselData): void => {
        setVarseldata(varseldata);
    };

    useEffect(() => {
        if (varseldata === undefined) return;
        const skjulVarselEtterMinutter = skjulVarselEtterMinutterUtenFeil ?? 0;
        if (skjulVarselEtterMinutter === 0) return;
        let intervalId: number;

        const checkShouldHide = () => {
            if(komponentlayout.visning === "minimal") return;

            const sisteOppdatertSidenDataEndretSeg = sistEndret ? sistEndret.getTime() : Date.now();
            const now = Date.now();
            const diffMinutes = (now - sisteOppdatertSidenDataEndretSeg) / 60000;
            console.log("Minutter siden siste oppdatering med data:", diffMinutes, skjulVarselEtterMinutter);
            if(diffMinutes > skjulVarselEtterMinutter && varseldata.varseltype === "grønt") {
                setKomponentlayout({visning: "minimal"});
            }
        };

        checkShouldHide();

        if (varseldata.varseltype === "grønt" && skjulVarselEtterMinutter > 0 && komponentlayout.visning !== "minimal") {
            intervalId = setInterval(checkShouldHide, 10000);
        }
        if(varseldata.varseltype !== "grønt" && komponentlayout.visning !== "full") {
            setKomponentlayout({visning: "full"});
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [varseldata, sistEndret]);

    useEffect(() => {
        const parsedata = JSON.parse(data) as VarselData
        setVarseldata(parsedata)
        const topic = `/komponent/${komponentUUID}/data`;
        const subscription = stompService.subscribe<VarselData>(topic, handleEvent);

        return () => {
            if (subscription) {
                stompService.unsubscribe(topic, subscription);
            }
        };
    }, []);

    if (!varseldata) {
        return <p>Noe gikk galt ved lasting av komponentdata</p>
    }

    if(komponentlayout.visning === "minimal") {
        return <></>;
    }

    if (varseldata.varseltype == "rødt") {
        return (
            <div className="alert alert-danger" role="alert">
                <h1>{varseldata.tekst ?? ""}</h1>
            </div>
        )
    } else if (varseldata.varseltype == "gult") {
        return (
            <div className="alert alert-warning" role="alert">
                <h1>{varseldata.tekst ?? ""}</h1>
            </div>
        )
    } else {
        return (
            <div className="alert alert-success" role="alert">
                <h1>{varseldata.tekst ?? ""}</h1>
            </div>
        )
    }
}

export const RedigerVarselKomponent: React.FC<KontrollpanelKomponent> = ({data}: KontrollpanelKomponent) => {
    const [varseldata, setVarseldata] = useState<VarselData>();
    const [valgtVarseltype, setValgtVarseltype] = useState<string>('');


    useEffect(() => {
        const parsedata = JSON.parse(data) as VarselData
        setVarseldata(parsedata)
    }, []);

    if (!varseldata) {
        return <p>Noe gikk galt ved lasting av komponentdata</p>
    }

    return (
        <>
            <FormSelect value={valgtVarseltype} onChange={(e) => setValgtVarseltype(e.target.value)}>
                <option key="rødt" value="rødt">Rødt</option>
                <option key="gult" value="gult">Gult</option>
                <option key="grønt" value="grønt">Grønt</option>
            </FormSelect>
            <FormControl type="text" defaultValue={varseldata.tekst}></FormControl>
        </>
    )
}

export default VarselKomponent;