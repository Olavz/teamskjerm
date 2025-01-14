type VarselData = {
    varseltype: "grønnt" | "gult" | "rødt";
    melding: string;
};

type MessageProp = {
    komponentUUID: string
    komponentData: string
}

const VarselKomponent: React.FC<MessageProp> = ({komponentData}: MessageProp) => {
    let varsel = JSON.parse(komponentData) as VarselData;
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

export default VarselKomponent;