import React, { FC, useState, useEffect } from 'react';
import { Theme } from '../../const';
import { mdiSettingsOutline } from '@mdi/js';

import { useAppState } from '../../services/state';
import { TabState } from '../../services/tab';

import { Tabs, Tab, Icon } from '../../ui';

import { Setup } from '../setup';
import { Write } from '../write';
import { Play } from '../play';

import './shell.css';

export const MainShell: FC = () => {

    const [state, actions] = useAppState();
    const [settings, setSettings] = useState(false);

    useEffect(() => {
        actions.playback.midi.init();
    }, [actions.playback.midi])

    return <>
        <div className="main-shell__topbar">
            <Tabs value={state.tab} onChange={actions.tab.set} background="#0d1216" highlight={Theme.primary}>
                <Tab value={TabState.setup}>Setup</Tab>
                <Tab value={TabState.write}>Write</Tab>
                <Tab value={TabState.engrave}>Engrave</Tab>
                <Tab value={TabState.play}>Play</Tab>
                <Tab value={TabState.print}>Print</Tab>
            </Tabs>
            <div className="main-shell__topbar-right">
                <Icon path={mdiSettingsOutline} size={24} color="#ffffff" onClick={() => setSettings(true)} />
            </div>
        </div>
        {state.tab === TabState.setup && <Setup state={state} actions={actions} />}
        {state.tab === TabState.write && <Write state={state} actions={actions} settings={settings} onSettingsClose={() => setSettings(false)} />}
        {state.tab === TabState.play && <Play state={state} actions={actions} settings={settings} onSettingsClose={() => setSettings(false)} />}
    </>;
}