import React, { FC, useMemo, useRef } from "react";
import { mdiChevronRight } from "@mdi/js";

import { Icon, SortableItem } from "solo-ui";

import { useAppState } from "../../services/state";
import { Instrument, useInstrumentName } from "../../services/instrument";
import { Text } from "../../components/text";

import "./instrument-item.css";

interface Props {
    index: number;
    selected: boolean;
    instrument: Instrument;
    count?: string;

    onSelectPlayer: () => void;
}

export const InstrumentItem: FC<Props> = ({ index, selected, instrument, count, onSelectPlayer }) => {
    const handle = useRef<HTMLDivElement>(null);
    const theme = useAppState(s => s.ui.theme.pallets);
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
            <div ref={handle} onPointerDown={onSelectPlayer}>
                <Text className="instrument-item__name">{name}</Text>
            </div>
            <Icon size={18} color={fg} path={mdiChevronRight} />
        </SortableItem>
    );
};
