import {useContext} from 'react';
import {DataContext} from "./BaseKomponentKontrollpanel.tsx";


const OppdaterbarTekstKomponent : React.FC = () => {

    const { kontrollpanelKomponent } = useContext(DataContext);

    return (
        <>
            <h1>{kontrollpanelKomponent ? kontrollpanelKomponent : 'Loading...'}</h1>
        </>
    );
}

export default OppdaterbarTekstKomponent;