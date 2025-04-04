import {useEffect, useState} from "react";
import {stompService} from "../../WebSocketService.tsx";
import {Button} from "react-bootstrap";
import {KontrollpanelKomponent} from "./KomponentKontrollpanel.tsx";

type MeldingData = {
    tekst: string;
};


const TekstKomponent: React.FC<KontrollpanelKomponent> = ({data, komponentUUID}: KontrollpanelKomponent) => {
    const [message, setMessage] = useState<string>('');

    const handleEvent = (message: MeldingData): void => {
        try {
            setMessage(message.tekst);
        } catch (error) {
            console.error('Failed to parse message body:', message, error);
        }
    };

    useEffect(() => {
        let parsedata = JSON.parse(data) as MeldingData
        setMessage(parsedata.tekst)
        const topic = `/komponent/${komponentUUID}`;
        const subscription = stompService.subscribe<MeldingData>(topic, handleEvent);

        return () => {
            if (subscription) {
                stompService.unsubscribe(topic, subscription);
            }
        };
    }, []);

    /*    const seMerInformasjonNaviger = (url: string) => {
            window.open(url, '_blank');
        };*/

    return (
        <>
            {message && <h1>{message}</h1>}
        </>
    )

}

export const RedigerTekstKomponent: React.FC<KontrollpanelKomponent> = ({data, komponentUUID, secret, secretHashKey}: KontrollpanelKomponent) => {
    const [inputValue, setInputValue] = useState<string>('');

    useEffect(() => {
        let dataleser = JSON.parse(data) as MeldingData
        setInputValue(dataleser.tekst ?? '');
    }, [data]);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(event.target.value);
    };

    const oppdaterData = async () => {

        try {
            const response = await fetch(`/api/ext/komponent/${komponentUUID}/${secret}/${secretHashKey}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({tekst: inputValue}),
            });

            if (!response.ok) {
                throw new Error('Failed to send data');
            }

            const result = await response.json();
            console.log('Success:', result);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="mb-3">
            <label className="form-label">Verdi</label>
            <textarea
                onChange={handleInputChange}
                className="form-control"
                rows={3}
                value={inputValue}
            />

            <Button size="sm" variant="info" onClick={oppdaterData}>Send oppdatering</Button>
        </div>
    );
};

export default TekstKomponent

