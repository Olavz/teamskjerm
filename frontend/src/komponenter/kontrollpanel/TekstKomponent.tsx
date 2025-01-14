import {useEffect, useState} from "react";
import {stompService} from "../../WebSocketService.tsx";

type MeldingData = {
    melding: string;
};

type MessageProp = {
    komponentUUID: string
    komponentData: string
}

const TekstKomponent: React.FC<MessageProp> = ({komponentUUID, komponentData}: MessageProp) => {
    const [message, setMessage] = useState<string | null>(null);

    const handleEvent = (message: MeldingData): void => {
        try {
            setMessage(message.melding);
        } catch (error) {
            console.error('Failed to parse message body:', message, error);
        }
    };

    useEffect(() => {
        let data = JSON.parse(komponentData) as MeldingData
        setMessage(data.melding)
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
            {message && <p>{message}</p>}

            {/*{data.seMerInformasjonUrl && <button type="button" onClick={() => seMerInformasjonNaviger(data.seMerInformasjonUrl)} className="btn btn-light">Se mer informasjon</button>}*/}
        </>
    )

}

export const RedigerTekstKomponent: React.FC<MessageProp> = ({komponentUUID, komponentData}: MessageProp) => {
    const [inputValue, setInputValue] = useState<string>('');

    useEffect(() => {
        let data = JSON.parse(komponentData) as MeldingData
        setInputValue(data.melding ?? '');
    }, [komponentData]);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(event.target.value);
    };

    const oppdaterData = async () => {

        try {
            const response = await fetch(`/api/komponent/${komponentUUID}/data`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({melding: inputValue}),
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

            <button onClick={oppdaterData}>Send oppdatering</button>
            <br/>
            <label className="form-label">Se mer informasjon url</label>
            <input
                className="form-control"
            />
        </div>
    );
};

export default TekstKomponent

