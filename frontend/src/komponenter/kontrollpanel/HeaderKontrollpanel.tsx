interface HeaderKontrollpanelProps {
    tittel?: string
}

export default function HeaderKontrollpanel({tittel}: HeaderKontrollpanelProps) {

    return (
        <>
            <div className="teamskjerm-header">
                <h2>Teamskjerm {tittel && <span>&rarr; {tittel}</span>}</h2>
            </div>

        </>

    )
}