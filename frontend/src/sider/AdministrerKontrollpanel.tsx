import {useEffect, useState} from "react";
import {NavLink, useParams} from "react-router-dom";
import AdministrerNyttKontrollpanelKomponent from "../komponenter/AdministrerNyttKontrollpanelKomponent.tsx";
import HeaderKontrollpanel from "../komponenter/kontrollpanel/HeaderKontrollpanel.tsx";
import {RedigerTekstKomponent} from "../komponenter/kontrollpanel/TekstKomponent.tsx";
import {BaseKomponentKontrollpanel} from "../komponenter/kontrollpanel/BaseKomponentKontrollpanel.tsx";
import VarselKomponent from "../komponenter/kontrollpanel/VarselKomponent.tsx";

interface KontrollpanelKomponent {
    komponentUUID: string;
    navn: string;
    data: string;
    komponentType: string;
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
                            if (item.komponentType == "TekstKomponent") {
                                return (
                                    <div className="col" key={item.komponentUUID}>
                                        <div>
                                            KomponentUUID: {item.komponentUUID}<br/>
                                            KomponentType: {item.komponentType}
                                        </div>
                                        <BaseKomponentKontrollpanel navn={item.navn}>
                                            <RedigerTekstKomponent
                                                komponentData={item.data}
                                                komponentUUID={item.komponentUUID}
                                            />
                                        </BaseKomponentKontrollpanel>
                                    </div>
                                )
                            } else if (item.komponentType == "VarselKomponent") {
                                return (
                                    <div className="col" key={item.komponentUUID}>
                                        <div>
                                            KomponentUUID: {item.komponentUUID}<br/>
                                            KomponentType: {item.komponentType}
                                        </div>
                                        <BaseKomponentKontrollpanel navn={item.navn}>
                                            <VarselKomponent
                                                komponentUUID={item.komponentUUID}
                                                komponentData={item.data}
                                            />
                                        </BaseKomponentKontrollpanel>
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
