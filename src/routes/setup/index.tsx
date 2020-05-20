import React, { FC, useState, useCallback } from "react";
import { mdiCogOutline } from "@mdi/js";

import { useTitle, Icon } from "solo-ui";

import { useAppActions, useAppState } from "../../services/state";
import { PlayerType, PlayerKey } from "../../services/player";
import { FlowKey } from "../../services/flow";
import { InstrumentDef } from "../../services/instrument-defs";

import { Selection, SelectionType } from "./selection";

import { PlayerList } from "./player-list";
import { FlowList } from "./flow-list";
import { LayoutList } from "./layout-list";
import { InstrumentSelector } from "./instrument-selector";
import { PlayerTypeSelector } from "../../dialogs/player-type-selector";
import { RenderRegion } from "../../components/render-region";
import { RenderWriteMode } from "../../components/render-write-mode";
import { Panel } from "../../components/panel";
import { SetupSettings } from "../../dialogs/setup-settings";

import "./setup.css";

interface Props { }

const Setup: FC<Props> = () => {
    useTitle("Solo Composer | Setup");

    const actions = useAppActions();
    const theme = useAppState(s => s.ui.theme.pallets);

    // local selection fine, we don't need to keep this after nav.
    const [selection, setSelection] = useState<Selection>(null);
    const [typeSelector, setTypeSelector] = useState<boolean>(false);
    const [instrumentSelector, setInstrumentSelector] = useState<boolean>(false);
    const [settings, setSettings] = useState<boolean>(false);

    // PLAYERS

    const onTypeSelected = useCallback((type?: PlayerType) => {
        setTypeSelector(false);
        if (type) {
            const playerKey = actions.score.players.create(type);
            setSelection({ key: playerKey, type: SelectionType.player });
            setInstrumentSelector(true);
        }
    }, [actions.score.players]);

    const onAddInstrument = useCallback(() => {
        setInstrumentSelector(true);
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
        setInstrumentSelector(false);
    }, [selection, actions.score.instruments, actions.score.players, actions.playback.sampler]);

    // FLOWS

    const onCreateFlow = useCallback(() => {
        const key = actions.score.flows.create();
        setSelection({ key, type: SelectionType.flow });
    }, [actions.score.flows]);

    const onRemoveFlow = useCallback(
        (flowKey: FlowKey) => {
            actions.score.flows.remove(flowKey);
            setSelection(null);
        },
        [actions.score.flows]
    );

    const onAssignPlayerToFlow = useCallback(
        (flowKey: FlowKey) => {
            if (selection) {
                const playerKey = selection.key;
                actions.score.flows.assignPlayer(flowKey, playerKey);
            }
        },
        [selection, actions.score.flows]
    );

    const onRemovePlayerFromFlow = useCallback(
        (flowKey: FlowKey) => {
            if (selection) {
                const playerKey = selection.key;
                actions.score.flows.removePlayer(flowKey, playerKey);
            }
        },
        [selection, actions.score.flows]
    );

    return (
        <>

            <Panel>
                <div className="panel__wrapper" />
                <div className="panel__wrapper">
                    <Icon
                        data-tooltip="Engrave Settings"
                        data-tooltip-direction="up"
                        className="panel__tool"
                        path={mdiCogOutline}
                        size={24}
                        color={theme.background[400].fg}
                        onClick={() => setSettings(true)}
                    />
                </div>
            </Panel>

            <div className="setup" style={{ backgroundColor: theme.background[500].bg }}>
                <PlayerList
                    selection={selection}
                    onSelectPlayer={setSelection}
                    onCreatePlayer={() => setTypeSelector(true)}
                    onAddInstrument={onAddInstrument}
                    onRemovePlayer={onRemovePlayer}
                />
                <div
                    className="setup__middle"
                    style={{
                        borderRight: `solid 4px ${theme.background[400].bg}`,
                        borderLeft: `solid 4px ${theme.background[400].bg}`
                    }}
                >
                    <RenderRegion className="setup__view">
                        <RenderWriteMode />
                    </RenderRegion>
                    <FlowList
                        selection={selection}
                        onSelectFlow={setSelection}
                        onCreateFlow={onCreateFlow}
                        onRemoveFlow={onRemoveFlow}
                        onAssignPlayer={onAssignPlayerToFlow}
                        onRemovePlayer={onRemovePlayerFromFlow}
                    />
                </div>
                <LayoutList />
            </div>

            <PlayerTypeSelector width={400} open={typeSelector} onClose={onTypeSelected} />
            <InstrumentSelector width={900} open={instrumentSelector} onSelect={onSelectInstrument} onCancel={() => setInstrumentSelector(false)} />
            <SetupSettings width={900} open={settings} onClose={() => setSettings(false)} />

        </>
    );
};

export default Setup;
