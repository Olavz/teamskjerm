import React from "react";
import {useDroppable} from "@dnd-kit/core";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {KomponentRekkefølge} from "./AdministrerKontrollpanel.tsx";
import {DraggableKomponentKort} from "./DraggableKomponentKort.tsx";
import {KontrollpanelKomponent} from "../../komponenter/kontrollpanel/KomponentKontrollpanel.tsx";

type ColumnComponentProps = {
    id: string,
    tittel?: string,
    kontrollpanelKomponenter: KontrollpanelKomponent[],
    komponenterRekkefølge: KomponentRekkefølge[],
    redigerVisning: boolean,
    visModalForKomponent: (komponentUUID: string) => void
};

const DroppableColumnComponent: React.FC<ColumnComponentProps> = ({
                                                                      id,
                                                                      tittel,
                                                                      komponenterRekkefølge,
                                                                      kontrollpanelKomponenter,
                                                                      redigerVisning,
                                                                      visModalForKomponent
                                                                  }) => {

    const {setNodeRef} = useDroppable({id, disabled: !redigerVisning});

    return (
        <div
            style={{
                flex: 1,
                background: "#f1f3f5",
                padding: "1rem",
                borderRadius: "8px",
                minHeight: "300px",
            }}
            ref={setNodeRef}
        >
            {tittel && <h2>{tittel}</h2>}
            <SortableContext
                disabled={!redigerVisning}
                items={komponenterRekkefølge.map(it => it.komponentUUID)}
                strategy={verticalListSortingStrategy}
            >
                {komponenterRekkefølge.map((komponent) => (
                    <DraggableKomponentKort
                        key={komponent.komponentUUID}
                        id={komponent.komponentUUID}
                        komponent={kontrollpanelKomponenter.find((it) => it.komponentUUID === komponent.komponentUUID)!}
                        redigerVisning={redigerVisning}
                        visModalForKomponent={visModalForKomponent}
                    />
                ))}
            </SortableContext>

        </div>
    );
};

export default DroppableColumnComponent