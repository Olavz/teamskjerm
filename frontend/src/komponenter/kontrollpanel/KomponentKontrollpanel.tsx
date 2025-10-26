import {ReactNode, useEffect, useState} from "react";
import {CardFooter} from "react-bootstrap";
import {stompService} from "../../WebSocketService.tsx";

export interface KontrollpanelKomponent {
    komponentUUID: string;
    navn: string;
    data: string;
    komponentType: string;
    seMerInformasjon?: string;
    secret?: string;
    secretHashKey?: string;
    jsonSkjema: string;
    sistOppdatert?: string;
    varsleUtenOppdateringerEtterMinutter?: number;
}

type BaseKomponentKontrollpanelProps = {
    kontrollpanelKomponent: KontrollpanelKomponent
    children: ReactNode
}

type SistOppdatert = {
    timestamp: string;
};

export const KomponentKontrollpanel: React.FC<BaseKomponentKontrollpanelProps> = ({
                                                                                      kontrollpanelKomponent,
                                                                                      children
                                                                                  }) => {

    const [sistOppdatert, setSistOppdatert] = useState<Date>()
    const [sistOppdatertVarsel, setUtdatertVarsel] = useState(false)

    useEffect(() => {
        if (kontrollpanelKomponent.sistOppdatert) {
            const parsedDate = new Date(kontrollpanelKomponent.sistOppdatert);
            if (!isNaN(parsedDate.getTime())) {
                setSistOppdatert(parsedDate);
            }
        }
    }, [kontrollpanelKomponent.sistOppdatert]);

    useEffect(() => {
        const topic = `/komponent/${kontrollpanelKomponent.komponentUUID}/sistOppdatert`;
        const subscription = stompService.subscribe<SistOppdatert>(topic, (sistOppdatert: SistOppdatert): void => {
            const parsedDate = new Date(sistOppdatert.timestamp);
            if (!isNaN(parsedDate.getTime())) {
                setSistOppdatert(parsedDate);
            }
        });

        return () => {
            if (subscription) {
                stompService.unsubscribe(topic, subscription);
            }
        };
    }, []);

    useEffect(() => {
        const varselEtterMinutter = kontrollpanelKomponent.varsleUtenOppdateringerEtterMinutter ?? 0;

        function evaluerOmKomponentBetraktesSomUtdatert() {
            if (varselEtterMinutter > 0 && sistOppdatert) {
                const minutterSidenOppdatert = (Date.now() - sistOppdatert.getTime()) / 60 / 1000;
                if (minutterSidenOppdatert > varselEtterMinutter) {
                    setUtdatertVarsel(true);
                    clearInterval(intervalId);
                } else {
                    setUtdatertVarsel(false);
                }
            }
        }

        const intervalId  = setInterval(() => {
            evaluerOmKomponentBetraktesSomUtdatert();
        }, 60000);

        evaluerOmKomponentBetraktesSomUtdatert();

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [kontrollpanelKomponent.varsleUtenOppdateringerEtterMinutter, sistOppdatert]);

    return (
        <div className={`card ${sistOppdatertVarsel ? " bg-warning" : ""}`}>
            <div className="card-body">
                <h3 className="card-title">{kontrollpanelKomponent.navn}</h3>
                {children}
            </div>
            <CardFooter>{sistOppdatert?.toLocaleString("nb-NO") || ""}</CardFooter>
        </div>
    )
}