import {createContext, ReactNode, useEffect, useState} from "react";

type BaseKomponentKontrollpanelProps = {
    navn: string
    children: ReactNode
}

type KomponentKonfigurasjon = {
    kontrollpanelId: string,
    komponentId: string
}

// Context for data
export const DataContext = createContext<{
    komponentKonfigurasjon: KomponentKonfigurasjon,
    komponentData: any;
    loading: boolean
}>({komponentKonfigurasjon: {kontrollpanelId: "", komponentId: ""}, komponentData: null, loading: true});

export const DataProvider: React.FC<{
    kontrollpanelId: string,
    komponentId: string,
    children: React.ReactNode
}> = ({kontrollpanelId, komponentId, children}) => {
    const [komponentKonfigurasjon, setKomponentKonfigurasjon] = useState<KomponentKonfigurasjon>({
        kontrollpanelId: "",
        komponentId: ""
    });
    const [komponentData, setKomponentData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setKomponentKonfigurasjon(
            {
                kontrollpanelId: kontrollpanelId,
                komponentId: komponentId
            }
        )
    }, []);

    useEffect(() => {
        // Last inn initiellt via REST
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/kontrollpanel/${kontrollpanelId}/komponent/${komponentId}/data`);
                const result = await response.json();
                setKomponentData(result.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    return <DataContext.Provider
        value={{komponentKonfigurasjon, komponentData, loading}}>{children}</DataContext.Provider>;
};

export const BaseKomponentKontrollpanel: React.FC<BaseKomponentKontrollpanelProps> = ({navn, children}) => {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{navn}</h5>
                {children}
            </div>
        </div>
    )
}