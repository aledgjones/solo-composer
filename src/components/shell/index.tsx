import React, { FC, useEffect, Suspense } from "react";

import { Tabs, Tab, useTheme, useStyles } from "solo-ui";
// import { useDebugger } from "../../debug/debugger";

import { useAppActions, useAppState } from "../../services/state";
import { TabState } from "../../services/ui";
import { useAutoSetup } from "../../services/auto-setup";

import { FileMenu } from "../file-menu";
import { Transport } from "../transport";
import { Fallback } from "./fallback";

import "./styles.css";

const Setup = React.lazy(() => import("../../routes/setup"));
const Write = React.lazy(() => import("../../routes/write"));
const Engrave = React.lazy(() => import("../../routes/engrave"));
const Play = React.lazy(() => import("../../routes/play"));

export const MainShell: FC = () => {
    useAutoSetup();
    // useDebugger();

    const actions = useAppActions();
    const { theme, tab } = useAppState((s) => {
        return {
            theme: s.app.theme.pallets,
            tab: s.ui.tab
        };
    });

    useTheme(theme.background[200].bg);
    useStyles(`.main-shell__tabs .ui-tab { color: ${theme.background[200].fg} !important }`); // slight hack on the tab element

    useEffect(() => {
        actions.app.audition.init();
        actions.app.theme.init();
        actions.playback.midi.init();
    }, [actions]);

    return (
        <>
            <div className="main-shell__title-bar" style={{ backgroundColor: theme.background[200].bg }}>
                <FileMenu />
                <Tabs
                    className="main-shell__tabs"
                    value={tab}
                    onChange={actions.ui.tab.set}
                    color={theme.background[200].fg}
                    highlight={theme.background[500].bg}
                >
                    <Tab value={TabState.setup}>Setup</Tab>
                    <Tab value={TabState.write}>Write</Tab>
                    <Tab value={TabState.engrave}>Engrave</Tab>
                    <Tab value={TabState.play}>Play</Tab>
                    <Tab value={TabState.print}>Print</Tab>
                </Tabs>
                <Transport />
            </div>

            <div className="main-shell__content" style={{ backgroundColor: theme.background[500].bg }}>
                <Suspense fallback={<Fallback color={theme.background[500].fg} type="loading" />}>
                    {tab === TabState.setup && <Setup />}
                    {tab === TabState.write && <Write />}
                    {tab === TabState.engrave && <Engrave />}
                    {tab === TabState.play && <Play />}
                    {tab === TabState.print && <Fallback color={theme.background[500].fg} type="empty" />}
                </Suspense>
            </div>
        </>
    );
};
