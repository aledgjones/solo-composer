import React, { FC, useState, useEffect, useCallback, Suspense } from 'react';
import { mdiCogOutline } from '@mdi/js';

import { Tabs, Tab, Icon, useForeground, useTheme, useStyles } from 'solo-ui';

import { THEME } from '../../const';
import { useAppActions, useAppState } from '../../services/state';
import { TabState } from '../../services/ui';
import { useAutoSetup } from '../../services/auto-setup';

import { Changelog } from '../changelog';
import { Transport } from '../transport';

import './shell.css';
import { Fallback } from './fallback';

const Setup = React.lazy(() => import('../../routes/setup'));
const Write = React.lazy(() => import('../../routes/write'));
const Play = React.lazy(() => import('../../routes/play'));

export const MainShell: FC = () => {

    useAutoSetup();

    const actions = useAppActions();
    const tab = useAppState(s => s.ui.tab);

    useEffect(() => {
        actions.playback.midi.init();
    }, [actions]);

    const bg = THEME.grey[300];
    const fg = useForeground(bg);

    return <>
        <div className="main-shell__topbar" style={{ backgroundColor: bg }}>
            <Tabs className="main-shell__tabs" value={tab} onChange={actions.ui.tab.set} color={fg} highlight={THEME.primary[500]}>
                <Tab value={TabState.setup}>Setup</Tab>
                <Tab value={TabState.write}>Write</Tab>
                <Tab value={TabState.engrave}>Engrave</Tab>
                <Tab value={TabState.play}>Play</Tab>
                <Tab value={TabState.print}>Print</Tab>
            </Tabs>
            <Transport />
        </div>

        <div className="main-shell__content" style={{ backgroundColor: THEME.grey[500] }}>
            <Suspense fallback={<Fallback type="loading" />}>
                {(tab === TabState.engrave || tab === TabState.print) && <Fallback type="empty" />}
                {tab === TabState.setup && <Setup />}
                {tab === TabState.write && <Write />}
                {tab === TabState.play && <Play />}
            </Suspense>
        </div>

        <Changelog />
    </>;
}