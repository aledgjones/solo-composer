import React, { FC, useState, useMemo, useEffect } from "react";
import { mdiCursorDefault, mdiEraser, mdiGreasePencil, mdiCogOutline } from "@mdi/js";

import { Select, Option, useRainbow, Icon, DragScroll, useTitle } from "solo-ui";

import { THEME } from "../../const";
import { useAppState, useAppActions } from "../../services/state";
import { TabState, Tool } from "../../services/ui";
import { useCounts } from "../../services/instrument";
import { entriesByTick } from "../../services/track";
import { useTicks, Ticks } from "./ticks";
import { PlayerControls } from "./player-contols";
import { PlayerTrack } from "./player-track";
import { PlaySettings } from "../../dialogs/play-settings";

import piano from "./keyboard/piano.svg";

import "./play.css";

const Play: FC = () => {
    useTitle("Solo Composer | Play");

    const { score, expanded, tool } = useAppState(s => {
        return {
            score: s.score,
            expanded: s.ui.expanded,
            tool: s.ui.tool[TabState.play]
        };
    });
    const actions = useAppActions();

    const [zoom] = useState<number>(1);
    const [settings, setSettings] = useState(false);

    const [flowKey, setFlowKey] = useState(score.flows.order[0]);
    const flow = score.flows.byKey[flowKey];
    const flowEntriesByTick = useMemo(
        () => entriesByTick(flow.master.entries.order, flow.master.entries.byKey),
        [flow.master.entries]
    );

    const counts = useCounts();
    const ticks = useTicks(flow.length, flowEntriesByTick, zoom);

    const colors = useRainbow(score.players.order.length);

    // deal with selection
    useEffect(() => {
        const callback = (e: any) => {
            const target = e.target as HTMLElement;
            if (tool === Tool.select && target.classList.contains("instrument-track")) {
                actions.ui.selection[TabState.play].clear();
            }
        };
        window.addEventListener("pointerdown", callback);

        return () => {
            window.removeEventListener("pointerdown", callback);
        };
    }, [tool, actions.ui.selection]);

    return (
        <>
            <DragScroll className="play" x ignore="no-scroll">
                <div className="play__x-fixed play__left-panel no-scroll">
                    <div className="play__tools-container" style={{ backgroundColor: THEME.grey[350].backgroundColor }}                >
                        <div className="play__tools">
                            <Icon
                                className="play__tool"
                                toggle={tool === Tool.select}
                                onClick={() => actions.ui.tool[TabState.play].set(Tool.select)}
                                path={mdiCursorDefault}
                                size={24}
                                color={THEME.grey[400].color}
                                highlight={THEME.primary[500].backgroundColor}
                            />
                            <Icon
                                className="play__tool"
                                toggle={tool === Tool.pencil}
                                onClick={() => actions.ui.tool[TabState.play].set(Tool.pencil)}
                                path={mdiGreasePencil}
                                size={24}
                                color={THEME.grey[400].color}
                                highlight={THEME.primary[500].backgroundColor}
                            />
                            <Icon
                                className="play__tool"
                                toggle={tool === Tool.eraser}
                                onClick={() => actions.ui.tool[TabState.play].set(Tool.eraser)}
                                path={mdiEraser}
                                size={24}
                                color={THEME.grey[400].color}
                                highlight={THEME.primary[500].backgroundColor}
                            />
                        </div>
                        <div className="play__settings">
                            <Icon
                                className="play__tool"
                                path={mdiCogOutline}
                                size={24}
                                color={THEME.grey[400].color}
                                onClick={() => setSettings(true)}
                            />
                        </div>
                    </div>

                    <div className="play__controls" style={{ backgroundColor: THEME.grey[500].backgroundColor }}>
                        <div
                            className="play__header-select"
                            style={{ backgroundColor: THEME.grey[400].backgroundColor }}
                        >
                            <Select
                                className="play__select"
                                label=""
                                color="white"
                                value={flowKey}
                                onChange={setFlowKey}
                            >
                                {score.flows.order.map(key => {
                                    const title = score.flows.byKey[key].title;
                                    return (
                                        <Option key={key} value={key} displayAs={title}>
                                            {title}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </div>
                        <div className="play__player-controls">
                            {score.players.order.map((playerKey, i) => {
                                if (flow.players.includes(playerKey)) {
                                    const player = score.players.byKey[playerKey];
                                    return (
                                        <PlayerControls
                                            key={playerKey}
                                            color={colors[i]}
                                            expanded={expanded[playerKey + "-play"]}
                                            player={player}
                                            instruments={score.instruments}
                                            counts={counts}
                                            onToggleExpand={actions.ui.expanded.toggle}
                                        />
                                    );
                                } else {
                                    return null;
                                }
                            })}
                        </div>
                    </div>
                </div>

                <div className="play__scrollable" style={{ backgroundColor: THEME.grey[500].backgroundColor }}>
                    <Ticks
                        className="play__ticks"
                        color={THEME.grey[800].backgroundColor}
                        highlight={THEME.grey[800].backgroundColor}
                        fixed={false}
                        ticks={ticks}
                        height={48}
                        style={{ backgroundColor: THEME.grey[400].backgroundColor }}
                    />
                    <div className="play__track-area">
                        {score.players.order.map((playerKey, i) => {
                            if (flow.players.includes(playerKey)) {
                                const player = score.players.byKey[playerKey];
                                return (
                                    <PlayerTrack
                                        key={playerKey}
                                        flowKey={flowKey}
                                        color={colors[i]}
                                        expanded={expanded[playerKey + "-play"]}
                                        player={player}
                                        instruments={score.instruments}
                                        staves={flow.staves}
                                        tracks={flow.tracks}
                                        ticks={ticks}
                                    />
                                );
                            } else {
                                return null;
                            }
                        })}
                    </div>
                </div>
            </DragScroll>

            <link rel="prefetch" href={piano} />
            <PlaySettings open={settings} width={900} onClose={() => setSettings(false)} />
        </>
    );
};

export default Play;
