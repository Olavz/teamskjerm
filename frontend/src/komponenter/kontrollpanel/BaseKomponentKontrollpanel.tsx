import {ReactNode} from "react";

type BaseKomponentKontrollpanelProps = {
    navn: string
    children: ReactNode
}

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