import React, { FC } from 'react';
import { mdiPlus } from '@mdi/js';

import { Icon, useForeground } from 'solo-ui';
import { SortableContainer } from '../../components/sortable-container';

import { THEME } from '../../const';
import { Player, PlayerKey } from '../../services/player';
import { Instruments } from '../../services/instrument';
import { InstrumentCounts } from '../../services/instrument-utils';
import { PlayerItem } from './player-item';
import { Selection } from "./selection";

import './player-list.css';

interface Props {
    players: Player[];
    instruments: Instruments;
    counts: InstrumentCounts;
    selection: Selection;
    expanded: { [key: string]: boolean };

    onSelectPlayer: (selection: Selection) => void;
    onToggleExpandPlayer: (playerKey: PlayerKey) => void;
    onAddInstrument: (playerKey: PlayerKey) => void;
    onRemovePlayer: (playerKey: PlayerKey) => void;
    onCreatePlayer: () => void;
}

export const PlayerList: FC<Props> = (props: Props) => {

    const { players, instruments, counts, selection, expanded, onSelectPlayer, onToggleExpandPlayer, onAddInstrument, onRemovePlayer, onCreatePlayer } = props;
    const fg400 = useForeground(THEME.grey[400]);

    return <div className="player-list" style={{ backgroundColor: THEME.grey[500] }}>
        <div className="player-list__header" style={{ backgroundColor: THEME.grey[400] }}>
            <span className="player-list__label" style={{ color: fg400 }}>Players</span>
            <Icon size={24} color={fg400} path={mdiPlus} onClick={onCreatePlayer} />
        </div>
        <SortableContainer y className="player-list__content">
            {players.map((player, i) => <PlayerItem
                key={player.key}
                player={player}
                instruments={instruments}
                counts={counts}

                selected={!!(selection && player.key === selection.key)}
                expanded={expanded[player.key + '-setup']}

                onSelectPlayer={onSelectPlayer}
                onToggleExpandPlayer={onToggleExpandPlayer}
                onAddInstrument={onAddInstrument}
                onRemovePlayer={onRemovePlayer}
            />)}
        </SortableContainer>
    </div>;
};

