import {useContext, useState} from "react";
import {DataContext} from "./BaseKomponentKontrollpanel.tsx";

type MeldingData = {
    melding: string;
};

const TekstKomponent: React.FC = () => {
    const { komponentData, loading } = useContext(DataContext);

    if (loading) {
        return (<p>Laster...</p>)
    } else {
        let data = JSON.parse(komponentData) as MeldingData;

        return (
            <>
                <p>{data.melding}</p>
            </>
        )
    }
}

export const RedigerTekstKomponent: React.FC = () => {

    const { komponentKonfigurasjon, komponentData, loading } = useContext(DataContext);

    if(!komponentKonfigurasjon) {
        return (<></>)
    }

    const {kontrollpanelId, komponentId} = komponentKonfigurasjon

    const [inputValue, setInputValue] = useState<string>(''); // State for verdien i boksen

    // Funksjon for å håndtere endring i tekstboksen
    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(event.target.value);
    };

    const lagreData = async () => {
        try {
            const response = await fetch(`/api/kontrollpanel/${kontrollpanelId}/komponent/${komponentId}/data`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ melding: inputValue }),
            });

            if (!response.ok) {
                throw new Error('Failed to send data');
            }

            const result = await response.json();
            console.log('Success:', result);
        } catch (error) {
            console.error('Error:', error);
        }
    }
    if (loading) {
        return (<p>Laster...</p>)
    } else {
        let data = JSON.parse(komponentData) as MeldingData;

        return (
            <>
                <div className="mb-3">
                    <label className="form-label">Verdi</label>
                    <textarea onChange={handleInputChange} className="form-control" rows={3}
                              defaultValue={data.melding ?? ""}/>
                    <button onClick={lagreData}>Lagre</button>
                </div>
            </>
        )
    }
}

export default TekstKomponent

