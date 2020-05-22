import React, { FC, useMemo, useRef } from "react";
import { mdiPiano, mdiDeleteOutline } from "@mdi/js";

import { Icon, SortableItem } from "solo-ui";

import { useAppState, useAppActions } from "../../services/state";
import { Instrument, useInstrumentName } from "../../services/score-instrument";
import { Text } from "../../components/text";

import "./instrument-item.css";

interface Props {
    index: number;
    selected: boolean;
    instrument: Instrument;
    count?: string;

    onSelect: () => void;
}

export const InstrumentItem: FC<Props> = ({ index, selected, instrument, count, onSelect }) => {
    const handle = useRef<HTMLDivElement>(null);
    const actions = useAppActions();
    const theme = useAppState(s => s.app.theme.pallets);
    const { bg, fg } = useMemo(() => {
        if (selected) {
            return theme.primary[600];
        } else {
            return theme.background[700];
        }
    }, [selected, theme]);

    const name = useInstrumentName(instrument, count);

    return (
        <SortableItem
            handle={handle}
            index={index}
            className="instrument-item"
            style={{ backgroundColor: bg, color: fg }}
        >
            <div ref={handle} onPointerDown={onSelect}>
                <Icon style={{ marginRight: 16 }} path={mdiPiano} color={fg} size={24} />
            </div>
            <Text className="instrument-item__name">{name}</Text>
            {selected && <>
                <Icon size={24} color={fg} path={mdiDeleteOutline} onClick={() => actions.score.instruments.remove(instrument.key)} />
            </>}
        </SortableItem>
    );
};
