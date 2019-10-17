import React, { FC } from 'react';
import { Theme } from '../const';

import { Tabs, Tab } from '../ui';
import { useAppState } from '../services/state';
import { TabState } from '../services/tab';

import { Setup } from './setup';
import { Write } from './write';

import './main-shell.css';

export const MainShell: FC = () => {

  const [state, actions] = useAppState();

  return <>
    <Tabs value={state.tab} onChange={actions.tab.set} background="#0d1216" highlight={Theme.primary}>
      <Tab value={TabState.setup}>Setup</Tab>
      <Tab value={TabState.write}>Write</Tab>
      <Tab value={TabState.engrave}>Engrave</Tab>
      <Tab value={TabState.play}>Play</Tab>
      <Tab value={TabState.print}>Print</Tab>
    </Tabs>
    {state.tab === TabState.setup && <Setup state={state} actions={actions} />}
    {state.tab === TabState.write && <Write state={state} actions={actions} />}
  </>;
}