import {useContext} from 'react';
import {DataContext} from "./BaseKomponentKontrollpanel.tsx";


const VarselKomponent : React.FC = () => {

    const {kontrollpanelKomponent} = useContext(DataContext);

    if (kontrollpanelKomponent === "true") {
        return (
            <div className="alert alert-danger" role="alert">
                dsl-hent-maskert-grunnlagsdata
            </div>
        )
    } else {
        return (
            <div className="alert alert-success" role="alert">
                We good!
            </div>
        )
    }
}

export default VarselKomponent;