import {useContext, useState} from "react";
import {DataContext} from "./BaseKomponentKontrollpanel.tsx";


const ForhaandsbestemtTekstKomponent: React.FC = () => {
    const { komponentData, loading } = useContext(DataContext);

    if (loading) return <p>Loading...</p>

    return (
        <>
                <p>{komponentData}</p>
        </>
    )
}

export const RedigerForhaandsbestemtTekstKomponent: React.FC = () => {

    const { komponentData, loading } = useContext(DataContext);

    const [inputValue, setInputValue] = useState<string>(''); // State for verdien i boksen

    // Funksjon for å håndtere endring i tekstboksen
    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(event.target.value);
    };

    if (loading) return <p>Loading...</p>

    const lagreData = async () => {
        try {
            const response = await fetch('/api/kontrollpanel/01941ebb-4356-7bce-8489-c66ee4f77c13/komponent/244e01ce-c0a2-4c61-af2b-c056a819a628/data', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: inputValue }),
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

    return (
        <>
            <div className="mb-3">
                <label className="form-label">Verdi</label>
                <textarea onChange={handleInputChange} className="form-control" rows={3} defaultValue={komponentData ?? ""} />
                <button onClick={lagreData}>Lagre</button>
            </div>
        </>
    )
}

export default ForhaandsbestemtTekstKomponent

