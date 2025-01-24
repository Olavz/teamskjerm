import {ReactNode} from "react";
import {CardFooter} from "react-bootstrap";

export interface KontrollpanelKomponent {
    komponentUUID: string;
    navn: string;
    data: string;
    komponentType: string;
    seMerInformasjon?: string;
    secret?: string;
    secretHashKey?: string;
    jsonSkjema: string;
    sistOppdatert?: string;
}

type BaseKomponentKontrollpanelProps = {
    kontrollpanelKomponent: KontrollpanelKomponent
    children: ReactNode
}

export const KomponentKontrollpanel: React.FC<BaseKomponentKontrollpanelProps> = ({
                                                                                      kontrollpanelKomponent,
                                                                                      children
                                                                                  }) => {

    const sistOppdatert = kontrollpanelKomponent.sistOppdatert ? kontrollpanelKomponent.sistOppdatert : ""
    return (
        <div className="card">
            <div className="card-body">
                <h3 className="card-title">{kontrollpanelKomponent.navn}</h3>
                {children}
            </div>
            <CardFooter>{sistOppdatert}</CardFooter>
        </div>
    )
}