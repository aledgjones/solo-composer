import React, { FC } from 'react';

import { Player, usePlayerName, usePlayerIcon } from '../../services/player';
import { Instruments, InstrumentCounts } from '../../services/instrument';
import { Icon } from '../../ui';
import { mdiChevronDown } from '@mdi/js';

import './player-controls.css';
import { InstrumentControls } from './instrument-controls';

interface Props {
    player: Player;
    expanded: boolean;
    instruments: Instruments;
    counts: InstrumentCounts;
    color: string;

    onToggleExpand: (key: string) => void;
}

export const PlayerControls: FC<Props> = ({ player, expanded, instruments, counts, color, onToggleExpand }) => {

    const name = usePlayerName(player, instruments, counts);
    const icon = usePlayerIcon(player);

    return <div className="player-controls">
        <div className="player-controls__header">
            <Icon style={{ marginRight: 16 }} size={24} color="#ffffff" path={icon} />
            <span className="player-controls__name">{name}</span>
            <Icon style={{ marginLeft: 12, transform: `rotateZ(${expanded ? '180deg' : '0'})` }} size={24} color="#ffffff" path={mdiChevronDown} onClick={() => onToggleExpand(player.key)} />
        </div>
        {expanded && <div className="player-controls__instruments">
            {player.instruments.map(instrumentKey => {
                const instrument = instruments[instrumentKey];
                const count = counts[instrumentKey];
                return <InstrumentControls key={instrumentKey} color={color} instrument={instrument} count={count} />
            })}
        </div>}
    </div>;
}

