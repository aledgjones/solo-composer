import React, { FC } from "react";
import { mdiPiano } from "@mdi/js";

import { Icon } from "solo-ui";

import { useInstrumentName, Instrument } from "../../services/instrument";
import { Keyboard } from "./keyboard";
import { Text } from "../../components/text";

import "./instrument-controls.css";
import { useAppState } from "../../services/state";
import { SLOT_HEIGHT } from "./instrument-track/get-tone-dimension";

interface Props {
    instrument: Instrument;
    count: string;
    color: string;
}

export const InstrumentControls: FC<Props> = ({ instrument, count, color }) => {
    const theme = useAppState(s => s.ui.theme.pallets);
    const name = useInstrumentName(instrument, count);

    return (
        <div className="instrument-controls__wrapper" style={{ borderLeft: `4px solid ${color}` }}>
            <div className="instrument-controls" style={{ height: SLOT_HEIGHT * 24, backgroundColor: theme.background[700].bg, color: theme.background[700].fg }}>
                <div className="instrument-controls__header">
                    <Icon style={{ marginRight: 16 }} size={24} color={theme.background[700].fg} path={mdiPiano} />
                    <Text className="instrument-controls__name">{name}</Text>
                </div>
            </div>
            <Keyboard instrumentKey={instrument.key} />
        </div>
    );
};
