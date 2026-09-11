import React from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {KontrollpanelKomponent} from "../../komponenter/kontrollpanel/KomponentKontrollpanel.tsx";
import {Badge, Button} from "react-bootstrap";
import PlaceholderKomponentKort from "./PlaceholderKomponentKort.tsx";

type KomponentKortInnholdProps = {
    komponent: KontrollpanelKomponent,
    redigerVisning: boolean,
    visModalForRedigeringAvKomponent: (komponentUUID: string) => void
    visModalForhaandsvisKomponent: (komponentUUID: string) => void
};

const baseStyle: React.CSSProperties = {
    padding: "12px",
    margin: "8px 0",
    borderRadius: "6px",
    background: "white",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
};

const KomponentKortInnhold = React.forwardRef<
    HTMLDivElement,
    KomponentKortInnholdProps & React.HTMLAttributes<HTMLDivElement>
>(({komponent, redigerVisning, visModalForRedigeringAvKomponent, visModalForhaandsvisKomponent, ...rest}, ref) => {
    if (!komponent) {
        return <PlaceholderKomponentKort/>
    }

    return (
        <div ref={ref} className={redigerVisning ? "draggableKomponentKortFlyttes" : "draggableKomponentKort"}
             {...rest}>
            <Badge bg="secondary">{komponent.komponentUUID}</Badge> <br/>
            <Badge bg="info">{komponent.komponentType}</Badge> <br/>
            <h3>{komponent.navn}</h3>
            {!redigerVisning && (
                <div className="btn-group">
                    <Button variant="outline-primary"
                            onClick={() => visModalForRedigeringAvKomponent(komponent.komponentUUID)}>Endre</Button>
                    <Button variant="outline-primary"
                            onClick={() => visModalForhaandsvisKomponent(komponent.komponentUUID)}>Forhåndsvis</Button>
                </div>
            )}
        </div>
    );
});

type DraggableKomponentKortProps = KomponentKortInnholdProps & {
    id: string,
};

// Brukes inni kolonnene/SortableContext - registrerer kortet som sorterbart.
export const DraggableKomponentKort: React.FC<DraggableKomponentKortProps> = ({id, ...props}) => {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id,
        disabled: !props.redigerVisning
    });

    const style: React.CSSProperties = {
        ...baseStyle,
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <KomponentKortInnhold ref={setNodeRef} style={style} {...attributes} {...listeners} {...props} />
    );
};

// Brukes kun inni DragOverlay - en ren visuell kopi uten egen useSortable-registrering,
// siden DragOverlay allerede håndterer posisjonering. To useSortable-instanser med
// samme id samtidig (kortet i kolonnen + kortet i overlayet) forstyrret ellers
// dnd-kits måling og gjorde flyten mellom kolonner hakkete.
export const KomponentKortOverlay: React.FC<KomponentKortInnholdProps> = (props) => {
    const style: React.CSSProperties = {
        ...baseStyle,
        cursor: "grabbing",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
    };

    return <KomponentKortInnhold style={style} {...props} />;
};
