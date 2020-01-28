import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { mdiPlus } from '@mdi/js';

import { Icon } from '../../ui';
import { Player, PlayerKey } from '../../services/player';
import { Instruments } from '../../services/instrument';
import { InstrumentCounts } from '../../services/instrument-utils';
import { PlayerItem } from './player-item';
import { SelectionType, Selection } from '.';

import './player-list.css';

interface Props {
  players: Player[];
  instruments: Instruments;
  counts: InstrumentCounts;
  selection: Selection;

  onSelectPlayer: (playerKey: PlayerKey, type: SelectionType) => void;
  onAddInstrument: (playerKey: PlayerKey) => void;
  onRemovePlayer: (playerKey: PlayerKey) => void;
  onCreatePlayer: () => void;
}

export const PlayerList = SortableContainer<Props>((props: Props) => {
  const { players, instruments, counts, selection, onSelectPlayer, onAddInstrument, onRemovePlayer, onCreatePlayer } = props;
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

        onSelectPlayer={onSelectPlayer}
        onAddInstrument={onAddInstrument}
        onRemovePlayer={onRemovePlayer}
      />)}
    </div>
  </div>;
});

