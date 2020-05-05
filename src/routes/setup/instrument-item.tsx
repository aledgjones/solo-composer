import React, { FC, useMemo, useRef } from "react";
import { mdiChevronRight } from "@mdi/js";

import { Icon, useForeground, SortableItem } from "solo-ui";

import { THEME } from "../../const";
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
    const bg = useMemo(() => {
        if (selected) {
            return THEME.primary[600];
        } else {
            return THEME.grey[700];
        }
    }, [selected]);
    const fg = useForeground(bg);

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
