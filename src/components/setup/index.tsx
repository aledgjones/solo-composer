import React, { FC, useState, useMemo, useCallback } from 'react';

import { PlayerType, Player, PlayerKey } from '../../services/player';
import { Flow, FlowKey } from '../../services/flow';
import { InstrumentDef } from '../../services/instrument-defs';
import { useCounts } from '../../services/instrument';
import { StaveKey } from '../../services/stave';

import { PlayerList } from './player-list';
import { FlowList } from './flow-list';
import { InstrumentPicker } from './instrument-picker';
import { RenderRegion } from '../shared/render-region';
import { RenderWriteMode } from '../shared/render-write-mode';

import './setup.css';
import { useAppState, useAppActions } from '../../services/state';
import { Score } from '../../services/score';

export enum SelectionType {
    player = 1,
    flow,
    layout
}

export type Selection = { key: string, type: SelectionType } | null;

interface Props {}

export const Setup: FC<Props> = () => {

    const actions = useAppActions();
    const score = useAppState<Score>(s => s.score);

    const [selection, setSelection] = useState<Selection>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const onSelect = useCallback((key: string, type: SelectionType) => {
        setSelection({ key, type });
    }, []);

    // PLAYERS

    const players = useMemo(() => {
        return score.players.order.map(key => {
            return score.players.byKey[key];
        });
    }, [score.players]);

    const onCreatePlayer = useCallback(() => {
        const player = actions.score.players.create(PlayerType.solo);
        setSelection({ key: player.key, type: SelectionType.player });
        setDialogOpen(true);
    }, [actions.score.players]);

    const onAddInstrument = useCallback(() => {
        setDialogOpen(true);
    }, []);

    const onRemovePlayer = useCallback((playerKey: PlayerKey) => {
        actions.score.players.remove(playerKey);
        setSelection(null);
    }, [actions.score.players]);

    const onSelectInstrument = useCallback((def: InstrumentDef) => {
        if (selection) {
            const channel = actions.playback.sampler.createChannel();
            const instrumentKey = actions.score.instruments.create(def);

            actions.score.players.assignInstrument(selection.key, instrumentKey);
            actions.playback.sampler.assignInstrument(instrumentKey, channel);
            actions.playback.sampler.load(channel, def);
        }
        setDialogOpen(false);
    }, [selection, actions.score.instruments, actions.score.players, actions.playback.sampler]);

    const onCancelInstrument = useCallback(() => {
        setDialogOpen(false);
    }, []);

    const onSortPlayers = useCallback((instruction) => {
        actions.score.players.reorder(instruction);
    }, [actions.score.players]);

    const counts = useCounts();

    // FLOWS

    const flows = useMemo(() => {
        return score.flows.order.map(key => {
            return score.flows.byKey[key];
        });
    }, [score.flows]);

    const onCreateFlow = useCallback(() => {
        const key = actions.score.flows.create();
        setSelection({ key, type: SelectionType.flow });
    }, [actions.score.flows]);

    const onRemoveFlow = useCallback((flowKey: FlowKey) => {
        actions.score.flows.remove(flowKey);
        setSelection(null);
    }, [actions.score.flows]);

    const onAssignPlayerToFlow = useCallback((flowKey: FlowKey) => {
        if (selection) {
            const playerKey = selection.key;
            actions.score.flows.assignPlayer(flowKey, playerKey);
        }
    }, [selection, actions.score.flows]);

    const onRemovePlayerFromFlow = useCallback((flowKey: FlowKey) => {
        if (selection) {
            const playerKey = selection.key;
            actions.score.flows.removePlayer(flowKey, playerKey);
        }
    }, [selection, actions.score.flows]);

    const onSortFlows = useCallback((instruction) => {
        actions.score.flows.reorder(instruction);
    }, [actions.score.flows]);

    return <>
        <div className="setup">
            <PlayerList
                players={players}
                instruments={score.instruments}
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
                <RenderRegion className="setup__view">
                    <RenderWriteMode score={score} />
                </RenderRegion>
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