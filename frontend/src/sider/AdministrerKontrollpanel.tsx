import {useEffect, useState} from "react";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import HeaderKontrollpanel from "../komponenter/kontrollpanel/HeaderKontrollpanel.tsx";
import {RedigerTekstKomponent} from "../komponenter/kontrollpanel/TekstKomponent.tsx";
import {KontrollpanelKomponent} from "../komponenter/kontrollpanel/KomponentKontrollpanel.tsx";
import {RedigerVarselKomponent} from "../komponenter/kontrollpanel/VarselKomponent.tsx";
import {
    AdministrerBaseKomponentKontrollpanel
} from "../komponenter/kontrollpanel/AdministrerKomponentKontrollpanel.tsx";
import {LeggTilKomponentButton} from "../komponenter/kontrollpanel/LeggTilKomponentButton.tsx";
import {Button} from "react-bootstrap";
import {teamskjermTokenCookie} from "../CookieHjelper.tsx";


type KontrollpanelParams = {
    kontrollpanelUUID: string;
};

function Kontrollpanel() {
    const [komponentopprettet, setKomponentopprettet] = useState<number>(0);
    const [kontrollpanelKomponenter, setKontrollpanelKomponenter] = useState<KontrollpanelKomponent[]>([]);
    const {kontrollpanelUUID} = useParams<KontrollpanelParams>();

    if (!kontrollpanelUUID) {
        return <p>Ingen ID spesifisert!</p>;
    }

    useEffect(() => {
        const navigate = useNavigate()
        fetch(`/api/kontrollpanel/${kontrollpanelUUID}/komponenter`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${teamskjermTokenCookie()}`
            }
        })
            .then((response) => {
                if (response.status == 403) {
                    navigate("/logginn")
                }
                return response.json()
            })
            .then((data: KontrollpanelKomponent[]) => setKontrollpanelKomponenter(data));
    }, [komponentopprettet]);

    const slettKomponent = async (komponentUUID: string) => {
        const navigate = useNavigate()
        try {
            const response = await fetch(`/api/kontrollpanel/${kontrollpanelUUID}/komponent/${komponentUUID}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${teamskjermTokenCookie()}`
                }
            });

            if (response.status == 403) {
                navigate("/logginn")
            }

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
        const navigate = useNavigate()

        try {
            const response = await fetch(`/api/kontrollpanel/${kontrollpanelUUID}/komponent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${teamskjermTokenCookie()}`
                },
                body: JSON.stringify(kontrollpanelKomponent),
            });

            if (response.status == 403) {
                navigate("/logginn")
            }

            if (!response.ok) {
                throw new Error('Failed to send data');
            }
            await response;
            setKomponentopprettet(komponentopprettet + 1)
        } catch (error) {
            console.error('Error:', error);
        }
    }

    let infoskjerm = `/kontrollpanel/${kontrollpanelUUID}`

    return (
        <>
            <div className="container">
                <HeaderKontrollpanel></HeaderKontrollpanel>
                <LeggTilKomponentButton opprettKomponent={opprettKomponent}/> {' '}
                <NavLink to={infoskjerm}><Button>Se inforskjerm</Button></NavLink>
                <br/>
                <br/>
                <div className="container">
                    {kontrollpanelKomponenter.map((item) => {
                        if (item.komponentType == "TekstKomponent") {
                            return (
                                <div className="row">
                                    <AdministrerBaseKomponentKontrollpanel slettKomponent={slettKomponent}
                                                                           kontrollpanelKomponent={item}>
                                        <RedigerTekstKomponent
                                            komponentData={item.data}
                                            komponentUUID={item.komponentUUID}
                                        />
                                    </AdministrerBaseKomponentKontrollpanel>
                                </div>
                            )
                        } else if (item.komponentType == "VarselKomponent") {
                            return (
                                <div className="row">
                                    <AdministrerBaseKomponentKontrollpanel slettKomponent={slettKomponent}
                                                                           kontrollpanelKomponent={item}>
                                        <RedigerVarselKomponent
                                            komponentUUID={item.komponentUUID}
                                            komponentData={item.data}
                                        />
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

export default Kontrollpanel
