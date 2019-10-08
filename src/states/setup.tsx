import React, { FC, useState, useMemo, useCallback } from 'react';

import { State, Actions } from '../services/state';
import { PlayerType, Player } from '../services/player';
import { InstrumentDef } from '../services/instrument-defs';
import { useCounts } from '../services/instrument';

import { PlayerList } from '../components/player-list';
import { InstrumentPicker } from '../components/instrument-picker';

import './setup.css';

interface Props {
    state: State;
    actions: Actions;
}

export const Setup: FC<Props> = ({ state, actions }) => {

    const [selectedPlayerKey, setSelectedPlayerKey] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const players = useMemo(() => {
        return state.score.players.order.map(key => {
            return state.score.players.byKey[key];
        });
    }, [state.score.players]);

    const onSelectPlayer = useCallback((key: string) => {
        setSelectedPlayerKey(key);
    }, []);

    const onRemovePlayer = useCallback((player: Player) => {
        actions.score.players.remove(player);
        setSelectedPlayerKey(null);
    }, [actions.score.players]);

    const onCreatePlayer = useCallback(() => {
        const key = actions.score.players.create(PlayerType.section);
        setSelectedPlayerKey(key);
        setDialogOpen(true);
    }, [actions.score.players]);

    const onAddInstrument = useCallback((key: string) => {
        setDialogOpen(true);
    }, []);

    const onSelectInstrument = useCallback((def: InstrumentDef) => {
        if (selectedPlayerKey) {
            const instrumentKey = actions.score.instruments.create(def);
            actions.score.players.assignInstrument(selectedPlayerKey, instrumentKey);
        }
        setDialogOpen(false);
    }, [selectedPlayerKey, actions.score.instruments, actions.score.players]);

    const onCancelInstrument = useCallback(() => {
        setDialogOpen(false);
    }, []);

    const onSortEnd = useCallback((instruction) => {
        actions.score.players.reorder(instruction);
    }, [actions.score.players]);

    const counts = useCounts(state.score.players, state.score.instruments);

    return <>
        <div className="setup">
            <PlayerList
                players={players}
                instruments={state.score.instruments}
                counts={counts}
                selectedKey={selectedPlayerKey}

                onSelect={onSelectPlayer}
                onAddInstrument={onAddInstrument}
                onRemovePlayer={onRemovePlayer}
                onCreatePlayer={onCreatePlayer}
                onSortEnd={onSortEnd}
            />
        </div>
        {dialogOpen && <InstrumentPicker onSelect={onSelectInstrument} onCancel={onCancelInstrument} />}
    </>;
}