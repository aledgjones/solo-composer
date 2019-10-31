import React, { FC, useState } from 'react';
import { Theme } from '../const';
import { mdiSettingsOutline } from '@mdi/js';

import { Tabs, Tab, Icon } from '../ui';
import { useAppState } from '../services/state';
import { TabState } from '../services/tab';

import { Setup } from './setup';
import { Write } from './write';
import { EngravingSettings } from '../components/engraving-settings';

import './main-shell.css';

export const MainShell: FC = () => {

  const [state, actions] = useAppState();
  const [settings, setSettings] = useState(true);

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
    {state.tab === TabState.write && <Write state={state} actions={actions} />}

    {settings && <EngravingSettings config={state.score.engraving} onClose={() => setSettings(false)} onUpdate={(layout, instruction) => actions.score.engraving.set(layout, instruction)} />}
  </>;
}