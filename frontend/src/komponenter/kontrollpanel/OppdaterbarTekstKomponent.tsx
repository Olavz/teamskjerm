import {useContext} from 'react';
import {DataContext} from "./BaseKomponentKontrollpanel.tsx";


const OppdaterbarTekstKomponent : React.FC = () => {

    const { komponentData, loading } = useContext(DataContext);

    return (
        <>
            {loading && <h1>Laster..</h1>}
            <h1>{komponentData ?? ""}</h1>
        </>
    );
}

export default OppdaterbarTekstKomponent;