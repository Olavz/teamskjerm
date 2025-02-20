import {useEffect, useState} from "react";
import {teamskjermTokenCookie} from "../CookieHjelper.tsx";
import {Button} from "react-bootstrap";
import {NavLink, useNavigate} from "react-router-dom";
import NavbarInnlogget from "../komponenter/NavbarInnlogget.tsx";

interface Kontrollpanel {
    kontrollpanelUUID: string;
    navn: string;
    komponenter: string[];
}

function MineKontrollpanel() {

    const [kontrollpaneler, setKontrollpaneler] = useState<Kontrollpanel[]>([]);

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
    }, []);

    return (
        <>
            <div className="container">
                <NavbarInnlogget />
                <h1>Mine kontrollpanel</h1>
                <br/>
                <div className="container">
                    <Button>Nytt kontrollpanel</Button>
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
