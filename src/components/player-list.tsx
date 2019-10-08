import React, { FC } from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { mdiPlus } from '@mdi/js';

import { Icon } from '../ui';
import { Player } from '../services/player';
import { PlayerItem } from './player-item';
import { InstrumentState, InstrumentCounts } from '../services/instrument';

import './player-list.css';

interface Props {
  players: Player[];
  instruments: InstrumentState;
  counts: InstrumentCounts;
  selectedKey: string | null;

  onSelect: (key: string) => void;
  onAddInstrument: (key: string) => void;
  onRemovePlayer: (player: Player) => void;
  onCreatePlayer: () => void;
}

export const PlayerList = SortableContainer<Props>((props: Props) => {
  const { players, instruments, counts, selectedKey, onSelect, onAddInstrument, onRemovePlayer, onCreatePlayer } = props;
  return <div className="player-list setup__column">
    <div className="setup__column-header">
      <span>Players</span>
      <Icon size={24} color="#ffffff" path={mdiPlus} onClick={onCreatePlayer} />
    </div>
    <div className="setup__column-content">
      {players.map((player, i) => <PlayerItem
        index={i}
        key={player.key}
        player={player}
        instruments={instruments}
        counts={counts}

        selected={player.key === selectedKey}

        onSelect={onSelect}
        onAddInstrument={onAddInstrument}
        onRemovePlayer={onRemovePlayer}
      />)}
    </div>
  </div>;
});

