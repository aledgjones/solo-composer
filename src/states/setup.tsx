import React, { FC, useState, useMemo, useCallback } from 'react';

import { State, Actions } from '../services/state';
import { PlayerType, Player } from '../services/player';
import { Flow } from '../services/flow';
import { InstrumentDef } from '../services/instrument-defs';
import { useCounts } from '../services/instrument';

import { PlayerList } from '../components/player-list';
import { FlowList } from '../components/flow-list';
import { InstrumentPicker } from '../components/instrument-picker';

import './setup.css';

interface Props {
    state: State;
    actions: Actions;
}

export const Setup: FC<Props> = ({ state, actions }) => {

    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const onSelect = useCallback((key: string) => {
        setSelectedKey(key);
    }, []);

    // PLAYERS

    const players = useMemo(() => {
        return state.score.players.order.map(key => {
            return state.score.players.byKey[key];
        });
    }, [state.score.players]);

    const onCreatePlayer = useCallback(() => {
        const key = actions.score.players.create(PlayerType.section);
        setSelectedKey(key);
        setDialogOpen(true);
    }, [actions.score.players]);

    const onAddInstrument = useCallback((key: string) => {
        setDialogOpen(true);
    }, []);

    const onRemovePlayer = useCallback((player: Player) => {
        actions.score.players.remove(player);
        setSelectedKey(null);
    }, [actions.score.players]);

    const onSelectInstrument = useCallback((def: InstrumentDef) => {
        if (selectedKey) {
            const instrumentKey = actions.score.instruments.create(def);
            actions.score.players.assignInstrument(selectedKey, instrumentKey);
        }
        setDialogOpen(false);
    }, [selectedKey, actions.score.instruments, actions.score.players]);

    const onCancelInstrument = useCallback(() => {
        setDialogOpen(false);
    }, []);

    const onSortPlayers = useCallback((instruction) => {
        actions.score.players.reorder(instruction);
    }, [actions.score.players]);

    const counts = useCounts(state.score.players, state.score.instruments);

    // FLOWS

    const flows = useMemo(() => {
        return state.score.flows.order.map(key => {
            return state.score.flows.byKey[key];
        });
    }, [state.score.flows]);

    const onCreateFlow = useCallback(() => {
        const key = actions.score.flows.create(state.score.players.order);
        setSelectedKey(key);
    }, [actions.score.flows, state.score.players.order]);

    const onRemoveFlow = useCallback((flow: Flow) => {
        actions.score.flows.remove(flow);
        setSelectedKey(null);
    }, [actions.score.flows]);

    const onSortFlows = useCallback((instruction) => {
        actions.score.flows.reorder(instruction);
    }, [actions.score.flows]);

    return <>
        <div className="setup">
            <PlayerList
                players={players}
                instruments={state.score.instruments}
                counts={counts}
                selectedKey={selectedKey}

                distance={5}
                lockAxis="y"
                useDragHandle
                transitionDuration={200}

                onSelect={onSelect}
                onCreatePlayer={onCreatePlayer}
                onAddInstrument={onAddInstrument}
                onRemovePlayer={onRemovePlayer}
                onSortEnd={onSortPlayers}
            />
            <div className="setup__middle">
                <div style={{flexGrow: 1}} />
                <FlowList
                    flows={flows}
                    selectedKey={selectedKey}

                    distance={5}
                    lockAxis="x"
                    axis="x"
                    useDragHandle
                    transitionDuration={200}

                    onSelect={onSelect}
                    onCreateFlow={onCreateFlow}
                    onRemoveFlow={onRemoveFlow}
                    onSortEnd={onSortFlows}
                />
            </div>
        </div>
        {dialogOpen && <InstrumentPicker onSelect={onSelectInstrument} onCancel={onCancelInstrument} />}
    </>;
}