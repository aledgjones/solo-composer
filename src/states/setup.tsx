import React, { FC, useState, useMemo, useCallback } from 'react';

import { State, Actions } from '../services/state';
import { PlayerType, Player } from '../services/player';
import { Flow, FlowKey } from '../services/flow';
import { InstrumentDef } from '../services/instrument-defs';
import { useCounts } from '../services/instrument';

import { PlayerList } from '../components/player-list';
import { FlowList } from '../components/flow-list';
import { InstrumentPicker } from '../components/instrument-picker';
import { StaveKey } from '../services/stave';

import './setup.css';

export enum SelectionType {
    player = 1,
    flow,
    layout
}

export type Selection = { key: string, type: SelectionType } | null;

interface Props {
    state: State;
    actions: Actions;
}

export const Setup: FC<Props> = ({ state, actions }) => {

    const [selection, setSelection] = useState<Selection>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const onSelect = useCallback((key: string, type: SelectionType) => {
        setSelection({ key, type });
    }, []);

    // PLAYERS

    const players = useMemo(() => {
        return state.score.players.order.map(key => {
            return state.score.players.byKey[key];
        });
    }, [state.score.players]);

    const onCreatePlayer = useCallback(() => {
        const player = actions.score.players.create(PlayerType.solo);
        setSelection({ key: player.key, type: SelectionType.player });
        setDialogOpen(true);
    }, [actions.score.players]);

    const onAddInstrument = useCallback((key: string) => {
        setDialogOpen(true);
    }, []);

    const onRemovePlayer = useCallback((player: Player) => {
        actions.score.players.remove(player, state.score.instruments);
        setSelection(null);
    }, [actions.score.players, state.score.instruments]);

    const onSelectInstrument = useCallback((def: InstrumentDef) => {
        if (selection) {
            const instrument = actions.score.instruments.create(def);
            actions.score.players.assignInstrument(selection.key, instrument);
        }
        setDialogOpen(false);
    }, [selection, actions.score.instruments, actions.score.players]);

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
        const key = actions.score.flows.create(state.score.players.order, state.score.players.byKey, state.score.instruments);
        setSelection({ key, type: SelectionType.flow });
    }, [actions.score.flows, state.score.players, state.score.instruments]);

    const onRemoveFlow = useCallback((flow: Flow) => {
        actions.score.flows.remove(flow);
        setSelection(null);
    }, [actions.score.flows]);

    const onAssignPlayerToFlow = useCallback((flowKey: FlowKey) => {
        if (selection) {
            const playerKey = selection.key;
            const player = state.score.players.byKey[playerKey];
            actions.score.flows.assignPlayer(flowKey, player, state.score.instruments);
        }
    }, [selection, actions.score.flows, state.score.instruments, state.score.players.byKey]);

    const onRemovePlayerFromFlow = useCallback((flowKey: FlowKey) => {
        if (selection) {
            const playerKey = selection.key;
            const instruments = state.score.players.byKey[playerKey].instruments;
            const staveKeys = instruments.reduce((output: StaveKey[], instrumentKey) => {
                const instrument = state.score.instruments[instrumentKey];
                return [...output, ...instrument.staves];
            }, []);
            actions.score.flows.removePlayer(flowKey, selection.key, staveKeys);
        }
    }, [selection, actions.score.flows, state.score.instruments, state.score.players.byKey]);

    const onSortFlows = useCallback((instruction) => {
        actions.score.flows.reorder(instruction);
    }, [actions.score.flows]);

    return <>
        <div className="setup">
            <PlayerList
                players={players}
                instruments={state.score.instruments}
                counts={counts}
                selection={selection}

                distance={5}
                lockAxis="y"
                useDragHandle
                transitionDuration={200}

                onSelectPlayer={onSelect}
                onCreatePlayer={onCreatePlayer}
                onAddInstrument={onAddInstrument}
                onRemovePlayer={onRemovePlayer}
                onSortEnd={onSortPlayers}
            />
            <div className="setup__middle">
                <div style={{ flexGrow: 1 }} /> {/* temp for spacing - eventually this will be a score view */}
                <FlowList
                    flows={flows}
                    selection={selection}

                    distance={5}
                    lockAxis="x"
                    axis="x"
                    useDragHandle
                    transitionDuration={200}

                    onSelectFlow={onSelect}
                    onCreateFlow={onCreateFlow}
                    onRemoveFlow={onRemoveFlow}
                    onAssignPlayer={onAssignPlayerToFlow}
                    onRemovePlayer={onRemovePlayerFromFlow}
                    onSortEnd={onSortFlows}
                />
            </div>
        </div>
        {dialogOpen && <InstrumentPicker onSelect={onSelectInstrument} onCancel={onCancelInstrument} />}
    </>;
}