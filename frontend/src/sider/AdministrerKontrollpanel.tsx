import {useEffect, useState} from "react";
import {NavLink, useParams} from "react-router-dom";
import {RedigerTekstKomponent} from "../komponenter/kontrollpanel/TekstKomponent.tsx";
import {KontrollpanelKomponent} from "../komponenter/kontrollpanel/KomponentKontrollpanel.tsx";
import {RedigerVarselKomponent} from "../komponenter/kontrollpanel/VarselKomponent.tsx";
import {
    AdministrerBaseKomponentKontrollpanel
} from "../komponenter/kontrollpanel/AdministrerKomponentKontrollpanel.tsx";
import {LeggTilKomponentButton} from "../komponenter/kontrollpanel/LeggTilKomponentButton.tsx";
import {Button} from "react-bootstrap";
import {teamskjermTokenCookie} from "../CookieHjelper.tsx";
import {RedigerPieChartKomponent} from "../komponenter/kontrollpanel/PieChatKomponent.tsx";
import NavbarInnlogget from "../komponenter/NavbarInnlogget.tsx";
import {RedigerBarChartKomponent} from "../komponenter/kontrollpanel/BarChatKomponent.tsx";
import {RedigerGrafanaKomponent} from "../komponenter/kontrollpanel/GrafanaKomponent.tsx";

export interface NyttKontrollpanel {
    id?: string;
    eierId?: string;
    navn: string;
    kontrollpanelUUID: string;
    komponenter?: string[];
}

type KontrollpanelParams = {
    kontrollpanelUUID: string;
};

function AdministrerKontrollpanel() {
    const [komponentopprettet, setKomponentopprettet] = useState<number>(0);
    const [kontrollpanelKomponenter, setKontrollpanelKomponenter] = useState<KontrollpanelKomponent[]>([]);
    const {kontrollpanelUUID} = useParams<KontrollpanelParams>();

    if (!kontrollpanelUUID) {
        return <p>Ingen ID spesifisert!</p>;
    }

    useEffect(() => {
        fetch(`/api/kontrollpanel/${kontrollpanelUUID}/komponenter`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${teamskjermTokenCookie()}`
            }
        })
            .then((response) => {
                return response.json()
            })
            .then((data: KontrollpanelKomponent[]) => setKontrollpanelKomponenter(data));
    }, [komponentopprettet]);

    const slettKomponent = async (komponentUUID: string) => {
        try {
            const response = await fetch(`/api/kontrollpanel/${kontrollpanelUUID}/komponent/${komponentUUID}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${teamskjermTokenCookie()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to send data');
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setKontrollpanelKomponenter(
            kontrollpanelKomponenter.filter((it) => it.komponentUUID != komponentUUID)
        )
    }

    const opprettKomponent = async (kontrollpanelUUID: string, kontrollpanelKomponent: KontrollpanelKomponent) => {

        try {
            const response = await fetch(`/api/kontrollpanel/${kontrollpanelUUID}/komponent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${teamskjermTokenCookie()}`
                },
                body: JSON.stringify(kontrollpanelKomponent),
            });

            if (!response.ok) {
                throw new Error('Failed to send data');
            }
            await response;
            setKomponentopprettet(komponentopprettet + 1)
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const infoskjerm = `/kontrollpanel/${kontrollpanelUUID}`

    return (
        <>
            <div className="container">
                <NavbarInnlogget/>
                <LeggTilKomponentButton opprettKomponent={opprettKomponent}/> {' '}
                <NavLink target="_blank" to={infoskjerm}><Button>Vis teamskjerm</Button></NavLink>
                <br/>
                <br/>
                <div className="container">
                    {kontrollpanelKomponenter.map((item) => {
                        if (item.komponentType == "TekstKomponent") {
                            return (
                                <div className="row" key={item.komponentUUID}>
                                    <AdministrerBaseKomponentKontrollpanel slettKomponent={slettKomponent}
                                                                           kontrollpanelKomponent={item}>
                                        <RedigerTekstKomponent  {...item}/>
                                    </AdministrerBaseKomponentKontrollpanel>
                                </div>
                            )
                        } else if (item.komponentType == "VarselKomponent") {
                            return (
                                <div className="row" key={item.komponentUUID}>
                                    <AdministrerBaseKomponentKontrollpanel slettKomponent={slettKomponent}
                                                                           kontrollpanelKomponent={item}>
                                        <RedigerVarselKomponent {...item} />
                                    </AdministrerBaseKomponentKontrollpanel>
                                </div>
                            )
                        } else if (item.komponentType == "PieChartKomponent") {
                            return (
                                <div className="row" key={item.komponentUUID}>
                                    <AdministrerBaseKomponentKontrollpanel slettKomponent={slettKomponent}
                                                                           kontrollpanelKomponent={item}>
                                        <RedigerPieChartKomponent {...item} />
                                    </AdministrerBaseKomponentKontrollpanel>
                                </div>
                            )
                        } else if (item.komponentType == "BarChartKomponent") {
                            return (
                                <div className="row" key={item.komponentUUID}>
                                    <AdministrerBaseKomponentKontrollpanel slettKomponent={slettKomponent}
                                                                           kontrollpanelKomponent={item}>
                                        <RedigerBarChartKomponent {...item} />
                                    </AdministrerBaseKomponentKontrollpanel>
                                </div>
                            )
                        } else if (item.komponentType == "GrafanaKomponent") {
                            return (
                                <div className="row" key={item.komponentUUID}>
                                    <AdministrerBaseKomponentKontrollpanel slettKomponent={slettKomponent}
                                                                           kontrollpanelKomponent={item}>
                                        <RedigerGrafanaKomponent {...item} />
                                    </AdministrerBaseKomponentKontrollpanel>
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
        </>
    )
}

export default AdministrerKontrollpanel
