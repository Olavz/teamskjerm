import {KomponentKontrollpanel, KontrollpanelKomponent} from "./KomponentKontrollpanel.tsx";
import {ReactNode} from "react";


type BaseKomponentKontrollpanelProps = {
    kontrollpanelKomponent: KontrollpanelKomponent
    children: ReactNode
}

export const AdministrerBaseKomponentKontrollpanel: React.FC<BaseKomponentKontrollpanelProps> = ({kontrollpanelKomponent, children}) => {
    return (
        <div className="col" key={kontrollpanelKomponent.komponentUUID}>
            <div>
                KomponentUUID: {kontrollpanelKomponent.komponentUUID}<br/>
                KomponentType: {kontrollpanelKomponent.komponentType}
            </div>
            <KomponentKontrollpanel kontrollpanelKomponent={kontrollpanelKomponent}>
                {children}
            </KomponentKontrollpanel>
        </div>
    )
}