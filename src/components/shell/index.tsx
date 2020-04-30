import React, { FC, useEffect, Suspense } from 'react';

import { Tabs, Tab } from 'solo-ui';

import { THEME } from '../../const';
import { useAppActions, useAppState } from '../../services/state';
import { TabState } from '../../services/ui';
import { useAutoSetup } from '../../services/auto-setup';

import { FileMenu } from '../file-menu';
import { Changelog } from '../changelog';
import { Transport } from '../transport';
import { Fallback } from './fallback';

import './styles.css';

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

    return <>

        <FileMenu />

        <div className="main-shell__topbar" style={{ backgroundColor: THEME.grey[300] }}>
            <Tabs className="main-shell__tabs" value={tab} onChange={actions.ui.tab.set} color={THEME.grey[800]} highlight={THEME.grey[500]}>
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