import React from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {KontrollpanelKomponent} from "../../komponenter/kontrollpanel/KomponentKontrollpanel.tsx";
import {Badge, Button} from "react-bootstrap";
import PlaceholderKomponentKort from "./PlaceholderKomponentKort.tsx";

type DraggableKomponentKortProps = {
    id: string,
    komponent: KontrollpanelKomponent,
    redigerVisning: boolean,
    visModalForRedigeringAvKomponent: (komponentUUID: string) => void
    visModalForhaandsvisKomponent: (komponentUUID: string) => void
};

export const DraggableKomponentKort: React.FC<DraggableKomponentKortProps> = ({
                                                                                  id,
                                                                                  komponent,
                                                                                  redigerVisning,
                                                                                  visModalForRedigeringAvKomponent,
                                                                                  visModalForhaandsvisKomponent
                                                                              }) => {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id, disabled: !redigerVisning});

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: "12px",
        margin: "8px 0",
        borderRadius: "6px",
        background: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    };

    if (!komponent) {
        return <PlaceholderKomponentKort />
    }

    return (
        <div ref={setNodeRef} className={redigerVisning ? "draggableKomponentKortFlyttes" : "draggableKomponentKort"}
             style={style} {...attributes} {...listeners}>
            <Badge bg="secondary">{komponent.komponentUUID}</Badge> <br/>
            <Badge bg="info">{komponent.komponentType}</Badge> <br/>
            <h3>{komponent.navn}</h3>
            {!redigerVisning && (
                <div className="btn-group">
                    <Button variant="outline-primary" onClick={() => visModalForRedigeringAvKomponent(komponent.komponentUUID)}>Endre</Button>
                    <Button variant="outline-primary" onClick={() => visModalForhaandsvisKomponent(komponent.komponentUUID)}>Forhåndsvis</Button>
                </div>
            )}
        </div>
    );
};