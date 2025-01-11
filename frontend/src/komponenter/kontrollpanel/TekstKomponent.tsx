import {useContext, useEffect, useState} from "react";
import {DataContext} from "./BaseKomponentKontrollpanel.tsx";

type MeldingData = {
    melding: string;
    seMerInformasjonUrl: string;
};

const TekstKomponent: React.FC = () => {
    const {komponentData, loading} = useContext(DataContext);

    const seMerInformasjonNaviger = (url: string) => {
        window.open(url, '_blank');
    };

    if (loading) {
        return (<p>Laster...</p>)
    } else {
        let data = JSON.parse(komponentData) as MeldingData;

        return (
            <>
                <p>{data.melding}</p>
                {data.seMerInformasjonUrl && <button type="button" onClick={() => seMerInformasjonNaviger(data.seMerInformasjonUrl)} className="btn btn-light">Se mer informasjon</button>}
            </>
        )
    }
}

export const RedigerTekstKomponent: React.FC = () => {
    const { komponentKonfigurasjon, komponentData, loading } = useContext(DataContext);

    const [inputValue, setInputValue] = useState<string>('');
    const [inputMerInformasjonUrl, setInputMerInformasjonUrl] = useState<string>('');

    useEffect(() => {
        if (komponentData) {
            try {
                const data = typeof komponentData === 'string' ? JSON.parse(komponentData) : komponentData;
                setInputValue(data.melding ?? '');
                setInputMerInformasjonUrl(data.seMerInformasjonUrl ?? '');
            } catch (error) {
                console.error('Error parsing komponentData:', error);
            }
        }
    }, [komponentData]);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(event.target.value);
    };

    const handleInputHjelpUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputMerInformasjonUrl(event.target.value);
    };

    const lagreData = async () => {
        if (!komponentKonfigurasjon) return;
        const { kontrollpanelId, komponentId } = komponentKonfigurasjon;

        try {
            const response = await fetch(`/api/kontrollpanel/${kontrollpanelId}/komponent/${komponentId}/data`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ melding: inputValue, seMerInformasjonUrl: inputMerInformasjonUrl }),
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

    if (loading || !komponentKonfigurasjon) {
        return <p>Laster...</p>;
    }

    return (
        <div className="mb-3">
            <label className="form-label">Verdi</label>
            <textarea
                onChange={handleInputChange}
                className="form-control"
                rows={3}
                value={inputValue}
            />
            <label className="form-label">Se mer informasjon url</label>
            <input
                onChange={handleInputHjelpUrlChange}
                className="form-control"
                value={inputMerInformasjonUrl}
            />
            <button onClick={lagreData}>Lagre</button>
        </div>
    );
};

export default TekstKomponent

