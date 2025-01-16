import {ReactNode} from "react";

export interface KontrollpanelKomponent {
    komponentUUID: string;
    navn: string;
    data: string;
    komponentType: string;
    seMerInformasjon?: string;
}

type BaseKomponentKontrollpanelProps = {
    kontrollpanelKomponent: KontrollpanelKomponent
    children: ReactNode
}

export const KomponentKontrollpanel: React.FC<BaseKomponentKontrollpanelProps> = ({kontrollpanelKomponent, children}) => {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{kontrollpanelKomponent.navn}</h5>
                {children}
            </div>
        </div>
    )
}