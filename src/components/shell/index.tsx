import React, { FC, useState, useEffect, useCallback } from 'react';
import { THEME } from '../../const';
import { mdiSettingsOutline } from '@mdi/js';

import { useLogger, useAppActions, useAppState } from '../../services/state';
import { TabState } from '../../services/ui';

import { Tabs, Tab, Icon } from '../../ui';

import { Setup } from '../setup';
import { Write } from '../write';
import { Play } from '../play';

import { Transport } from './transport';

import './shell.css';

export const MainShell: FC = () => {

    useLogger();

    const actions = useAppActions();
    const tab = useAppState<TabState>(s => s.ui.tab);
    const [settings, setSettings] = useState(false);

    const openSettings = useCallback(() => setSettings(true), []);
    const closeSettings = useCallback(() => setSettings(false), []);

    useEffect(() => {
        actions.playback.midi.init();
    }, [actions]);

    return <>
        <div className="main-shell__topbar">
            <Tabs className="main-shell__tabs" value={tab} onChange={actions.ui.tab.set} background="#0d1216" highlight={THEME.primary}>
                <Tab value={TabState.setup}>Setup</Tab>
                <Tab value={TabState.write}>Write</Tab>
                <Tab value={TabState.engrave}>Engrave</Tab>
                <Tab value={TabState.play}>Play</Tab>
                <Tab value={TabState.print}>Print</Tab>
            </Tabs>
            <Transport />
            <div className="main-shell__topbar-right">
                <Icon path={mdiSettingsOutline} size={24} color="#ffffff" onClick={openSettings} />
            </div>
        </div>
        {tab === TabState.setup && <Setup />}
        {tab === TabState.write && <Write settings={settings} onSettingsClose={closeSettings} />}
        {tab === TabState.play && <Play settings={settings} onSettingsClose={closeSettings} />}
    </>;
}