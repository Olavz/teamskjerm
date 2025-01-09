import {useEffect, useState} from "react";
import {NavLink, useParams} from "react-router-dom";
import AdministrerNyttKontrollpanelKomponent from "../komponenter/AdministrerNyttKontrollpanelKomponent.tsx";
import HeaderKontrollpanel from "../komponenter/kontrollpanel/HeaderKontrollpanel.tsx";
import {RedigerTekstKomponent} from "../komponenter/kontrollpanel/TekstKomponent.tsx";
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

function Kontrollpanel() {
    const [data, setData] = useState<KontrollpanelKomponent[]>([]);
    const {kontrollpanelId} = useParams<KontrollpanelParams>(); //01941ebb-4356-7bce-8489-c66ee4f77c13

    if (!kontrollpanelId) {
        return <p>Ingen ID spesifisert!</p>;
    }

    useEffect(() => {
        fetch(`/api/kontrollpanel/${kontrollpanelId}/komponenter`)
            .then((response) => response.json())
            .then((data: KontrollpanelKomponent[]) => setData(data));
    }, []);

    let infoskjerm = `/kontrollpanel/${kontrollpanelId}`

    return (
        <>
            <div className="container">
                <HeaderKontrollpanel></HeaderKontrollpanel>
                <NavLink to={infoskjerm}>Se infoskjerm</NavLink>
                <div className="container">
                    <div className="row">
                        {data.map((item) => {
                            if (item.komponentNavn == "TekstKomponent") {
                                return (
                                    <div className="col" key={item.id}>
                                        <div>
                                            KomponentId: {item.id}<br/>
                                            KomponentType: {item.komponentNavn}
                                        </div>
                                        <DataProvider
                                            kontrollpanelId={kontrollpanelId}
                                            komponentId={item.id}
                                        >
                                            <BaseKomponentKontrollpanel navn={item.navn}>
                                                <RedigerTekstKomponent/>
                                            </BaseKomponentKontrollpanel>
                                        </DataProvider>
                                    </div>
                                )
                            } else if (item.komponentNavn == "VarselKomponent") {
                                return (
                                    <div className="col" key={item.id}>
                                        <div>
                                            KomponentId: {item.id}<br/>
                                            KomponentType: {item.komponentNavn}
                                        </div>
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
                    <div className="row">
                        <div className="col">
                            <AdministrerNyttKontrollpanelKomponent/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Kontrollpanel
