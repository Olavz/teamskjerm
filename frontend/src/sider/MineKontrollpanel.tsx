import {useEffect, useState} from "react";
import {teamskjermTokenCookie} from "../CookieHjelper.tsx";
import {NavLink, useNavigate} from "react-router-dom";
import NavbarInnlogget from "../komponenter/NavbarInnlogget.tsx";
import {LeggTilKontrollpanelButton} from "../komponenter/kontrollpanel/LeggTilKontrollpanelButton.tsx";
import {NyttKontrollpanel} from "./administrerkontrollpanel/AdministrerKontrollpanel.tsx";

interface Kontrollpanel {
    kontrollpanelUUID: string;
    navn: string;
    komponenter: string[];
}

function MineKontrollpanel() {


    const [kontrollpaneler, setKontrollpaneler] = useState<Kontrollpanel[]>([]);
    const [kontrollpanelOpprettet, setKontrollpanelOpprettet] = useState<number>(0);

    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/kontrollpanel`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${teamskjermTokenCookie()}`
            }
        })
            .then((response) => {
                if (response.status === 403) {
                    navigate("/logginn");
                    return Promise.reject("Unauthorized");
                }
                return response.json()
            })
            .then((data: Kontrollpanel[]) => setKontrollpaneler(data));
    }, [kontrollpanelOpprettet]);

    const opprettKontrollpanel = async (kontrollpanel: NyttKontrollpanel) => {

        try {
            const response = await fetch(`/api/kontrollpanel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${teamskjermTokenCookie()}`
                },
                body: JSON.stringify(kontrollpanel),
            });

            if (!response.ok) {
                throw new Error('Failed to send data');
            }
            await response;
            setKontrollpanelOpprettet(kontrollpanelOpprettet + 1)
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <>
            <div className="container">
                <NavbarInnlogget />
                <h1>Mine kontrollpanel</h1>
                <br/>
                <div className="container">
                    <LeggTilKontrollpanelButton opprettKontrollpanel={opprettKontrollpanel}/>
                    {kontrollpaneler.map((item, index) => {
                        return (
                            <div className="row" key={index}>
                                <h5>{item.navn} | Antall komponenter: {item.komponenter.length} | <NavLink to={"/administrer/kontrollpanel/" + item.kontrollpanelUUID}>administrer</NavLink> | <NavLink target="_blank" to={"/kontrollpanel/" + item.kontrollpanelUUID}>vis teamskjerm</NavLink> </h5>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default MineKontrollpanel
