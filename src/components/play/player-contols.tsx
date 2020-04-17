import React, { FC, useCallback } from 'react';
import { mdiChevronDown } from '@mdi/js';

import { Icon } from 'solo-ui';

import { Player, usePlayerName, usePlayerIcon } from '../../services/player';
import { InstrumentCounts } from '../../services/instrument-utils';
import { Instruments } from '../../services/instrument';
import { InstrumentControls } from './instrument-controls';
import { Text } from '../shared/text';

import './player-controls.css';
import { THEME } from '../../const';

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

    const toggle = useCallback(() => onToggleExpand(player.key), [onToggleExpand, player.key]);

    return <div className="player-controls" style={{backgroundColor: THEME.grey[600]}}>
        <div className="player-controls__header">
            <Icon style={{ marginRight: 16 }} size={24} color="#ffffff" path={icon} />
            <Text style={{ whiteSpace: 'pre' }} className="player-controls__name">{name}</Text>
            <Icon style={{ marginLeft: 12, transform: `rotateZ(${expanded ? '180deg' : '0'})` }} size={24} color="#ffffff" path={mdiChevronDown} onClick={toggle} />
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

