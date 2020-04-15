import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { mdiPlus } from '@mdi/js';

import { Icon } from 'solo-ui';

import { Player, PlayerKey } from '../../services/player';
import { Instruments } from '../../services/instrument';
import { InstrumentCounts } from '../../services/instrument-utils';
import { PlayerItem } from './player-item';
import { Selection } from  "./selection";

import './player-list.css';

interface Props {
    players: Player[];
    instruments: Instruments;
    counts: InstrumentCounts;
    selection: Selection;
    expanded: {[key: string]: boolean};

    onSelectPlayer: (selection: Selection) => void;
    onToggleExpandPlayer: (playerKey: PlayerKey) => void;
    onAddInstrument: (playerKey: PlayerKey) => void;
    onRemovePlayer: (playerKey: PlayerKey) => void;
    onCreatePlayer: () => void;
}

export const PlayerList = SortableContainer<Props>((props: Props) => {

    const { players, instruments, counts, selection, expanded, onSelectPlayer, onToggleExpandPlayer, onAddInstrument, onRemovePlayer, onCreatePlayer } = props;

    return <div className="player-list">
        <div className="player-list__header">
            <span className="player-list__label">Players</span>
            <Icon size={24} color="#ffffff" path={mdiPlus} onClick={onCreatePlayer} />
        </div>
        <div className="player-list__content">
            {players.map((player, i) => <PlayerItem
                index={i}
                key={player.key}
                player={player}
                instruments={instruments}
                counts={counts}

                selected={!!(selection && player.key === selection.key)}
                expanded={expanded[player.key]}

                onSelectPlayer={onSelectPlayer}
                onToggleExpandPlayer={onToggleExpandPlayer}
                onAddInstrument={onAddInstrument}
                onRemovePlayer={onRemovePlayer}
            />)}
        </div>
    </div>;
});

