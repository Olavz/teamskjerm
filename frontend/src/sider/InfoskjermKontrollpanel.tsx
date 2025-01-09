import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import HeaderKontrollpanel from "../komponenter/kontrollpanel/HeaderKontrollpanel.tsx";
import TekstKomponent from "../komponenter/kontrollpanel/TekstKomponent.tsx";
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
                            if (item.komponentNavn == "TekstKomponent") {
                                return (
                                    <div className="col" key={item.id}>
                                        <DataProvider
                                            kontrollpanelId={kontrollpanelId}
                                            komponentId={item.id}
                                           >
                                            <BaseKomponentKontrollpanel navn={item.navn}>
                                                <TekstKomponent></TekstKomponent>
                                            </BaseKomponentKontrollpanel>
                                        </DataProvider>
                                    </div>
                                )
                            } else if (item.komponentNavn == "VarselKomponent") {
                                return (
                                    <div className="col" key={item.id}>
                                        <DataProvider
                                            kontrollpanelId={kontrollpanelId}
                                            komponentId={item.id}
                                        >
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
