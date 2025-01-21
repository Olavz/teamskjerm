import {Button} from "react-bootstrap";
import {clearTeamskjermTokenCookie, setTeamskjermTokenCookie, teamskjermTokenCookie} from "../CookieHjelper.tsx";
import {useEffect} from "react";

type AccessTokenResponse = {
    accessToken: string
}

function Logginnside() {

    useEffect(() => {
        fetch(`/api/user`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${teamskjermTokenCookie()}`
            }
        })
            .then((response) => {
                alert("We got " + response.status)
            })
    }, []);

    const handleLogginn = async () => {

        try {
            const response = await fetch(`/api/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: "admin",
                    password: "admin"
                }),
            });

            const token: AccessTokenResponse = await response.json()
            setTeamskjermTokenCookie(token.accessToken)
        } catch (e) {
            clearTeamskjermTokenCookie()
        }

    }

    return (
        <>
            <h1>Hello world!</h1>
            <Button onClick={handleLogginn}>Logg inn</Button>
        </>
    )

}

export default Logginnside
