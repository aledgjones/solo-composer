import React, { FC } from 'react';

import { Player } from '../../services/player';
import { Instruments } from '../../services/instrument';
import { InstrumentTrack } from './instrument-track';
import { Ticks, Tick } from './ticks';
import { Staves } from '../../services/stave';
import { Tracks } from '../../services/track';
import { FlowKey } from '../../services/flow';

import './player-track.css';
import { THEME } from '../../const';

interface Props {
    flowKey: FlowKey;
    color: string;
    expanded: boolean;
    player: Player;
    instruments: Instruments;
    staves: Staves;
    tracks: Tracks;
    ticks: Tick[];
}

export const PlayerTrack: FC<Props> = ({ color, expanded, player, instruments, staves, tracks, ticks, flowKey }) => {

    return <div className="player-track">
        <Ticks ticks={ticks} style={{backgroundColor: THEME.grey[700]}} />
        {expanded && <div className="player-track__instruments">
            {player.instruments.map(instrumentKey => {
                const instrument = instruments[instrumentKey];
                return <InstrumentTrack key={instrumentKey} flowKey={flowKey} color={color} instrument={instrument} staves={staves} tracks={tracks} ticks={ticks} />
            })}
        </div>}
    </div>;
}

