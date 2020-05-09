import React, { FC } from "react";
import { mdiPlay, mdiMetronome, mdiFastForward, mdiRewind, mdiSkipPrevious } from "@mdi/js";
import { Icon } from "solo-ui";
import { useAppState, useAppActions } from "../../services/state";

import "./styles.css";

export const Transport: FC = () => {

    const actions = useAppActions();
    const { theme, metronome } = useAppState(s => {
        return {
            theme: s.ui.theme.pallets,
            metronome: s.playback.settings.metronome
        }
    });

    return (
        <div className="transport">
            <div className="transport__controls">
                <Icon
                    onClick={() => false}
                    className="transport__icon"
                    size={24}
                    color={theme.background[200].fg}
                    path={mdiSkipPrevious}
                />
                <Icon
                    onClick={() => false}
                    className="transport__icon"
                    size={24}
                    color={theme.background[200].fg}
                    path={mdiRewind}
                />
                <Icon
                    onClick={() => false}
                    className="transport__icon"
                    size={24}
                    color={theme.background[200].fg}
                    path={mdiFastForward}
                />
                <Icon
                    onClick={() => false}
                    className="transport__icon"
                    size={24}
                    color={theme.background[200].fg}
                    path={mdiPlay}
                />
            </div>
            <div
                className="transport__timestamp"
                style={{ border: `1px solid ${theme.background[500].bg}`, color: theme.background[200].fg }}
            >
                <span>0.0.0.000</span>
            </div>
            <div className="transport__metronome">
                <Icon
                    toggle={metronome}
                    onClick={actions.playback.settings.metronome.toggle}
                    size={24}
                    color={theme.background[200].fg}
                    highlight={theme.primary[500].bg}
                    path={mdiMetronome}
                />
            </div>
        </div>
    );
};
