import React, { FC } from 'react';

import { Player, usePlayerName, usePlayerIcon } from '../../services/player';
import { Instruments, InstrumentCounts } from '../../services/instrument';
import { Icon } from '../../ui';
import { mdiChevronDown } from '@mdi/js';

import './player-controls.css';
import { InstrumentControls } from './instrument-contols';

interface Props {
    player: Player;
    instruments: Instruments;
    counts: InstrumentCounts;
}

export const PlayerControls: FC<Props> = ({ player, instruments, counts }) => {

    const name = usePlayerName(player, instruments, counts);
    const icon = usePlayerIcon(player);

    return <div className="player-controls">
        <div className="player-controls__header">
            <Icon style={{ marginRight: 16 }} size={24} color="#ffffff" path={icon} />
            <span className="player-controls__name">{name}</span>
            <Icon style={{ marginLeft: 12 }} size={24} color="#ffffff" path={mdiChevronDown} />
        </div>
        <div className="player__instruments">
            {player.instruments.map(instrumentKey => {
                const instrument = instruments[instrumentKey];
                const count = counts[instrumentKey];
                return <InstrumentControls key={instrumentKey} instrument={instrument} count={count} />
            })}
        </div>
    </div>;
}

