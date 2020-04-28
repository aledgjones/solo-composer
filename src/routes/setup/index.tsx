import React, { FC, useState, useCallback } from 'react';

import { Dialog } from 'solo-ui';

import { useAppState, useAppActions } from '../../services/state';
import { PlayerType, PlayerKey } from '../../services/player';
import { FlowKey } from '../../services/flow';
import { InstrumentDef } from '../../services/instrument-defs';
import { useCounts } from '../../services/instrument';

import { Selection, SelectionType } from './selection';

import { THEME } from '../../const';
import { PlayerList } from './player-list';
import { FlowList } from './flow-list';
import { InstrumentPicker } from './instrument-picker';
import { RenderRegion } from '../../components/render-region';
import { RenderWriteMode } from '../../components/render-write-mode';
import { useTitle } from '../../components/use-title';

import './setup.css';

interface Props { }

const Setup: FC<Props> = () => {

    useTitle('Solo Composer | Setup');

    const actions = useAppActions();
    const { flows, players, instruments, expanded } = useAppState(s => {
        return {
            flows: s.score.flows.order.map(key => {
                return s.score.flows.byKey[key];
            }),
            players: s.score.players.order.map(key => {
                return s.score.players.byKey[key];
            }),
            instruments: s.score.instruments,
            expanded: s.ui.expanded
        }
    });

    // local selection fine, we don't need to keep this after nav.
    const [selection, setSelection] = useState<Selection>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    // PLAYERS

    const onCreatePlayer = useCallback(() => {
        const playerKey = actions.score.players.create(PlayerType.solo);
        setSelection({ key: playerKey, type: SelectionType.player });
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
            const instrument = actions.score.instruments.create(def);

            actions.score.players.assignInstrument(selection.key, instrument.key);
            actions.playback.sampler.assignInstrument(instrument.key, channel);
            actions.playback.sampler.load(channel, def);
        }
        setDialogOpen(false);
    }, [selection, actions.score.instruments, actions.score.players, actions.playback.sampler]);

    const onCancelInstrument = useCallback(() => {
        setDialogOpen(false);
    }, []);

    const counts = useCounts();

    // FLOWS

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

    return <>
        <div className="setup" style={{ backgroundColor: THEME.grey[500] }}>
            <PlayerList
                players={players}
                instruments={instruments}
                counts={counts}
                selection={selection}
                expanded={expanded}

                distance={5}
                lockAxis="y"
                useDragHandle
                transitionDuration={200}

                onSelectPlayer={setSelection}
                onToggleExpandPlayer={actions.ui.expanded.toggle}
                onCreatePlayer={onCreatePlayer}
                onAddInstrument={onAddInstrument}
                onRemovePlayer={onRemovePlayer}
                onSortEnd={actions.score.players.reorder}
            />
            <div className="setup__middle" style={{ borderRight: `solid 4px ${THEME.grey[400]}`, borderLeft: `solid 4px ${THEME.grey[400]}` }}>
                <RenderRegion className="setup__view">
                    <RenderWriteMode />
                </RenderRegion>
                <FlowList
                    flows={flows}
                    selection={selection}

                    distance={5}
                    lockAxis="x"
                    axis="x"
                    useDragHandle
                    transitionDuration={200}

                    onSelectFlow={setSelection}
                    onCreateFlow={onCreateFlow}
                    onRemoveFlow={onRemoveFlow}
                    onAssignPlayer={onAssignPlayerToFlow}
                    onRemovePlayer={onRemovePlayerFromFlow}
                    onSortEnd={actions.score.flows.reorder}
                />
            </div>
        </div>

        <Dialog width={900} open={dialogOpen}>
            {() => <InstrumentPicker onSelect={onSelectInstrument} onCancel={onCancelInstrument} />}
        </Dialog>
    </>;
}

export default Setup;