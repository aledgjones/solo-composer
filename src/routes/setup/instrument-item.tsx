import React, { FC, useMemo, useRef } from "react";
import { mdiChevronRight } from "@mdi/js";

import { Icon, SortableItem } from "solo-ui";

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
    const { backgroundColor, color } = useMemo(() => {
        if (selected) {
            return THEME.primary[600];
        } else {
            return THEME.grey[700];
        }
    }, [selected]);

    const name = useInstrumentName(instrument, count);

    return (
        <SortableItem
            handle={handle}
            index={index}
            className="instrument-item"
            style={{ backgroundColor: backgroundColor, color: color }}
        >
            <div ref={handle} onPointerDown={onSelectPlayer}>
                <Text className="instrument-item__name">{name}</Text>
            </div>
            <Icon size={18} color={color} path={mdiChevronRight} />
        </SortableItem>
    );
};
