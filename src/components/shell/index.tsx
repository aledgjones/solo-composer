import React, { FC, useEffect, Suspense } from "react";

import { Tabs, Tab, useForeground } from "solo-ui";
// import { useDebugger } from "../../services/debugger";

import { THEME } from "../../const";
import { useAppActions, useAppState } from "../../services/state";
import { TabState } from "../../services/ui";
import { useAutoSetup } from "../../services/auto-setup";

import { FileMenu } from "../file-menu";
import { About } from "../about";
import { Transport } from "../transport";
import { Fallback } from "./fallback";

import "./styles.css";

const Setup = React.lazy(() => import("../../routes/setup"));
const Write = React.lazy(() => import("../../routes/write"));
const Play = React.lazy(() => import("../../routes/play"));

export const MainShell: FC = () => {
    useAutoSetup();
    // useDebugger();

    const actions = useAppActions();
    const tab = useAppState(s => s.ui.tab);

    const fg = useForeground(THEME.grey[300]);

    useEffect(() => {
        actions.playback.midi.init();
    }, [actions]);

    return (
        <>
            <div className="main-shell__title-bar" style={{ backgroundColor: THEME.grey[300] }}>
                <FileMenu />
                <Tabs
                    className="main-shell__tabs"
                    value={tab}
                    onChange={actions.ui.tab.set}
                    color={fg}
                    highlight={THEME.grey[500]}
                >
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
                    {(tab === TabState.engrave || tab === TabState.print) && (
                        <Fallback type="empty" />
                    )}
                    {tab === TabState.setup && <Setup />}
                    {tab === TabState.write && <Write />}
                    {tab === TabState.play && <Play />}
                </Suspense>
            </div>

            <About />
        </>
    );
};
