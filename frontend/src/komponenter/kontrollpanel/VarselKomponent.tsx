import {useContext} from 'react';
import {DataContext} from "./BaseKomponentKontrollpanel.tsx";

type VarselData = {
    harFeilet: boolean;
    melding: string;
};

const VarselKomponent: React.FC = () => {
    const {komponentData, loading} = useContext(DataContext)

    if (loading) {
        return (<p>Laster...</p>)
    } else {
        let varsel = JSON.parse(komponentData) as VarselData;

        if (varsel.harFeilet ?? false) {
            return (
                <div className="alert alert-danger" role="alert">
                    {varsel.melding}
                </div>
            )
        } else {
            return (
                <div className="alert alert-success" role="alert">
                    {varsel.melding ?? "Ingen"}
                </div>
            )
        }
    }
}

export default VarselKomponent;