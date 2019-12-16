import React, { FC } from 'react';

import { Player } from '../../services/player';
import { Instruments } from '../../services/instrument';
import { InstrumentTrack } from './instrument-track';
import { Ticks, Tick } from './ticks';
import { Staves } from '../../services/stave';

import './player-track.css';

interface Props {
    color: string;
    expanded: boolean;
    player: Player;
    instruments: Instruments;
    staves: Staves;
    ticks: Tick[];
}

export const PlayerTrack: FC<Props> = ({ color, expanded, player, instruments, staves, ticks }) => {

    return <div className="player-track">
        <Ticks ticks={ticks} />
        {expanded && <div className="player-track__instruments">
            {player.instruments.map(instrumentKey => {
                const instrument = instruments[instrumentKey];
                return <InstrumentTrack key={instrumentKey} color={color} instrument={instrument} staves={staves} ticks={ticks} />
            })}
        </div>}
    </div>;
}

