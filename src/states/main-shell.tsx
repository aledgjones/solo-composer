import React, { FC } from 'react';
import './main-shell.css';
import { Tabs, Tab } from '../ui';
import { THEME } from '../const';
import { Setup } from './setup';
import { Menu } from '../ui/components/menu';
import { useAppState } from '../services/state';
import { TabState } from '../services/tab';

export const MainShell: FC = () => {

  const [state, actions] = useAppState();

  return <>
    <Menu />
    <Tabs value={state.tab} onChange={actions.tab.set} background="#0d1216" highlight={THEME.PRIMARY}>
      <Tab value={TabState.setup}>Setup</Tab>
      <Tab value={TabState.write}>Write</Tab>
      <Tab value={TabState.engrave}>Engrave</Tab>
      <Tab value={TabState.play}>Play</Tab>
      <Tab value={TabState.print}>Print</Tab>
    </Tabs>
    {state.tab === TabState.setup && <Setup state={state} actions={actions} />}
  </>;
}