import React, { FC } from "react";

import { FlowKey } from "../../services/flow";
import { Player } from "../../services/player";
import { Instruments } from "../../services/instrument";
import { Staves } from "../../services/stave";
import { Tracks } from "../../services/track";
import { InstrumentTrack } from "./instrument-track";
import { Ticks } from "./ticks";
import { TickList } from "./ticks/defs";

import "./player-track.css";
import { useAppState } from "../../services/state";

interface Props {
    flowKey: FlowKey;
    color: string;
    expanded: boolean;
    player: Player;
    instruments: Instruments;
    staves: Staves;
    tracks: Tracks;
    ticks: TickList;
}

export const PlayerTrack: FC<Props> = ({ color, expanded, player, instruments, staves, tracks, ticks, flowKey }) => {

    const theme = useAppState(s => s.ui.theme.pallets);

    return (
        <div className="player-track" style={{ backgroundColor: theme.background[700].bg }}>
            <Ticks
                className="player-track__ticks"
                fixed={false}
                color={theme.background[800].bg}
                highlight={theme.background[800].bg}
                height={48}
                ticks={ticks}
            />

            {expanded && (
                <div className="player-track__instruments">
                    {player.instruments.map(instrumentKey => {
                        const instrument = instruments[instrumentKey];
                        return (
                            <InstrumentTrack
                                key={instrumentKey}
                                flowKey={flowKey}
                                color={color}
                                instrument={instrument}
                                staves={staves}
                                tracks={tracks}
                                ticks={ticks}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};
