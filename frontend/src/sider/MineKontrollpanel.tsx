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
    const [lasterKontrollpanel, setLasterKontrollpanel] = useState<boolean>(true);
    const navigate = useNavigate();
    const [brukernavn, setBrukernavn] = useState()

    useEffect(() => {
        setLasterKontrollpanel(true);
        fetch(`/api/user`, {
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
                response.json().then((data) => setBrukernavn(data.name));
            })
    }, []);

    useEffect(() => {
        setLasterKontrollpanel(true);
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
            .then((data: Kontrollpanel[]) => setKontrollpaneler(data))
            .finally(() => setLasterKontrollpanel(false));
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
            <NavbarInnlogget />
            <div className="container">
                <h1 style={{marginTop: '1.5rem'}}>Velkommen {brukernavn} 👋</h1>
                <p>Kontrollpanel brukes til å administrere komponenter og sette sammen visning på skjerm.</p>
                <div style={{marginBottom: '1.5rem'}}>
                    <LeggTilKontrollpanelButton opprettKontrollpanel={opprettKontrollpanel}/>
                </div>
                {lasterKontrollpanel ? (
                    <div style={{textAlign: 'center', marginTop: '2rem'}}>
                        <span role="img" aria-label="Laster">⏳</span> Laster kontrollpaneler...
                    </div>
                ) : kontrollpaneler.length === 0 ? (
                    <div style={{textAlign: 'center', marginTop: '2rem', color: '#888'}}>
                        <span role="img" aria-label="Ingen">📭</span> Du har ingen kontrollpaneler ennå.
                    </div>
                ) : (
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center'}}>
                        {kontrollpaneler.map((item) => (
                            <div key={item.kontrollpanelUUID} style={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '10px',
                                padding: '1.5rem',
                                minWidth: '260px',
                                maxWidth: '460px',
                                background: '#fafbfc',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                            }}>
                                <h3 style={{marginBottom: '0.5rem'}}>{item.navn}</h3>
                                <div style={{marginBottom: '0.5rem'}}>
                                    <span style={{background: '#e3f2fd', color: '#1976d2', borderRadius: '12px', padding: '0.2em 0.7em', fontSize: '0.95em'}}>
                                        {item.komponenter.length} komponent{item.komponenter.length === 1 ? '' : 'er'}
                                    </span>
                                </div>
                                <div style={{display: 'flex', gap: '1em'}}>
                                    <NavLink to={"/administrer/kontrollpanel/" + item.kontrollpanelUUID} style={{textDecoration: 'none', color: '#1976d2'}} title="Administrer">
                                        <span role="img" aria-label="Administrer">🛠️</span> Administrer komponenter og visning
                                    </NavLink>
                                    <NavLink target="_blank" to={"/kontrollpanel/" + item.kontrollpanelUUID} style={{textDecoration: 'none', color: '#388e3c'}} title="Vis teamskjerm">
                                        <span role="img" aria-label="Vis">🖥️</span> Vis
                                    </NavLink>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default MineKontrollpanel
