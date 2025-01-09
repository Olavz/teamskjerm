import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import HeaderKontrollpanel from "../komponenter/kontrollpanel/HeaderKontrollpanel.tsx";
import ForhaandsbestemtTekstKomponent from "../komponenter/kontrollpanel/ForhaandsbestemtTekstKomponent.tsx";
import OppdaterbarTekstKomponent from "../komponenter/kontrollpanel/OppdaterbarTekstKomponent.tsx";
import {BaseKomponentKontrollpanel, DataProvider} from "../komponenter/kontrollpanel/BaseKomponentKontrollpanel.tsx";
import VarselKomponent from "../komponenter/kontrollpanel/VarselKomponent.tsx";

interface KontrollpanelKomponent {
    id: string;
    navn: string;
    data: string;
    komponentNavn: string;
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
                            if (item.komponentNavn == "ForhaandsbestemtTekstKomponent") {
                                return (
                                    <div className="col" key={item.id}>
                                        <DataProvider
                                            url={`/api/kontrollpanel/${kontrollpanelId}/komponent/${item.id}/data`}
                                            subscriptionPath={`/kontrollpanel/${kontrollpanelId}/komponent/${item.id}`}>
                                            <BaseKomponentKontrollpanel navn={item.navn}>
                                                <ForhaandsbestemtTekstKomponent></ForhaandsbestemtTekstKomponent>
                                            </BaseKomponentKontrollpanel>
                                        </DataProvider>
                                    </div>
                                )
                            } else if (item.komponentNavn == "OppdaterbarTekstKomponent") {
                                return (
                                    <div className="col" key={item.id}>
                                        <DataProvider
                                            url={`/api/kontrollpanel/${kontrollpanelId}/komponent/${item.id}/data`}
                                            subscriptionPath={`/kontrollpanel/${kontrollpanelId}/komponent/${item.id}`}>
                                            <BaseKomponentKontrollpanel navn={item.navn}>
                                                <OppdaterbarTekstKomponent></OppdaterbarTekstKomponent>
                                            </BaseKomponentKontrollpanel>
                                        </DataProvider>
                                    </div>
                                )
                            } else if (item.komponentNavn == "VarselKomponent") {
                                return (
                                    <div className="col" key={item.id}>
                                        <DataProvider
                                            url={`/api/kontrollpanel/${kontrollpanelId}/komponent/${item.id}/data`}
                                            subscriptionPath={`/kontrollpanel/${kontrollpanelId}/komponent/${item.id}`}>
                                            <BaseKomponentKontrollpanel navn={item.navn}>
                                                <VarselKomponent/>
                                            </BaseKomponentKontrollpanel>
                                        </DataProvider>
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
