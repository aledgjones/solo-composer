import React, { FC, useState, useEffect, useCallback, Suspense } from 'react';
import { mdiCogOutline } from '@mdi/js';

import { Tabs, Tab, Icon } from 'solo-ui';

import { THEME } from '../../const';
import { useAppActions, useAppState } from '../../services/state';
import { TabState } from '../../services/ui';
import { useAutoSetup } from '../../services/auto-setup';

import { Transport } from './transport';
import { Changelog } from '../shared/changelog';

import './shell.css';

const Setup = React.lazy(() => import('../setup'));
const Write = React.lazy(() => import('../write'));
const Play = React.lazy(() => import('../play'));

export const MainShell: FC = () => {

    useAutoSetup();

    const actions = useAppActions();
    const tab = useAppState(s => s.ui.tab);
    const [settings, setSettings] = useState(false);

    const openSettings = useCallback(() => setSettings(true), []);
    const closeSettings = useCallback(() => setSettings(false), []);

    useEffect(() => {
        actions.playback.midi.init();
    }, [actions]);

    return <>
        <div className="main-shell__topbar">
            <Tabs className="main-shell__tabs" value={tab} onChange={actions.ui.tab.set} background="#0d1216" highlight={THEME.primary[500].bg}>
                <Tab value={TabState.setup}>Setup</Tab>
                <Tab value={TabState.write}>Write</Tab>
                <Tab value={TabState.engrave}>Engrave</Tab>
                <Tab value={TabState.play}>Play</Tab>
                <Tab value={TabState.print}>Print</Tab>
            </Tabs>
            <Transport />
            <div className="main-shell__topbar-right">
                <Icon path={mdiCogOutline} size={24} color="#ffffff" onClick={openSettings} />
            </div>
        </div>
        <Suspense fallback={null}>
            {tab === TabState.setup && <Setup />}
            {tab === TabState.write && <Write settings={settings} onSettingsClose={closeSettings} />}
            {tab === TabState.play && <Play settings={settings} onSettingsClose={closeSettings} />}
        </Suspense>

        <Changelog />
    </>;
}