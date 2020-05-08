import React, { FC } from "react";

import { THEME } from "../../const";
import { FlowKey } from "../../services/flow";
import { Player } from "../../services/player";
import { Instruments } from "../../services/instrument";
import { Staves } from "../../services/stave";
import { Tracks } from "../../services/track";
import { InstrumentTrack } from "./instrument-track";
import { Ticks } from "./ticks";
import { TickList } from "./ticks/defs";

import "./player-track.css";

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

export const PlayerTrack: FC<Props> = ({
    color,
    expanded,
    player,
    instruments,
    staves,
    tracks,
    ticks,
    flowKey
}) => {
    return (
        <div className="player-track" style={{ backgroundColor: THEME.grey[700].backgroundColor }}>
            <Ticks
                className="player-track__ticks"
                fixed={false}
                color={THEME.grey[800].backgroundColor}
                highlight={THEME.grey[800].backgroundColor}
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
