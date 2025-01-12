import {useContext} from 'react';
import {DataContext} from "./BaseKomponentKontrollpanel.tsx";

type VarselData = {
    varseltype: "grønnt" | "gult" | "rødt";
    melding: string;
};

const VarselKomponent: React.FC = () => {
    const {komponentData, loading} = useContext(DataContext)

    if (loading) {
        return (<p>Laster...</p>)
    } else {
        let varsel = JSON.parse(komponentData) as VarselData;
console.log(varsel)
        if (varsel.varseltype == "rødt") {
            return (
                <div className="alert alert-danger" role="alert">
                    {varsel.melding ?? ""}
                </div>
            )
        } else if (varsel.varseltype == "gult") {
            return (
                <div className="alert alert-warning" role="alert">
                    {varsel.melding ?? ""}
                </div>
            )
        } else {
            return (
                <div className="alert alert-success" role="alert">
                    {varsel.melding ?? ""}
                </div>
            )
        }
    }
}

export default VarselKomponent;