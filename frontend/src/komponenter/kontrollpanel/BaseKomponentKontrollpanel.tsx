import {createContext, ReactNode, useEffect, useState} from "react";

type BaseKomponentKontrollpanelProps = {
    navn: string
    children: ReactNode
}

type KomponentKonfigurasjon = {
    komponentUUID: string
}

// Context for data
export const DataContext = createContext<{
    komponentKonfigurasjon: KomponentKonfigurasjon,
    komponentData: any;
    loading: boolean
}>({komponentKonfigurasjon: {komponentUUID: ""}, komponentData: null, loading: true});

export const DataProvider: React.FC<{
    komponentUUID: string,
    children: React.ReactNode
}> = ({komponentUUID, children}) => {
    const [komponentKonfigurasjon, setKomponentKonfigurasjon] = useState<KomponentKonfigurasjon>({
        komponentUUID: ""
    });
    const [komponentData, setKomponentData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setKomponentKonfigurasjon(
            {
                komponentUUID: komponentUUID
            }
        )
    }, []);

    useEffect(() => {
        // Last inn initiellt via REST
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/komponent/${komponentUUID}/data`);
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