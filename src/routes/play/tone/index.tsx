import React, { FC, useMemo, useCallback, PointerEvent } from "react";
import Color from "color";

import { Tool, TabState } from "../../../services/ui";
import { SLOT_HEIGHT } from "../instrument-track/get-tone-dimension";
import { useAppActions, useAppState } from "../../../services/state";
import { Tone } from "../../../entries/tone";
import { Entry } from "../../../entries";
import { Pitch } from "../../../playback/utils";

import "./styles.css";

interface Props {
    tone: Entry<Tone>;

    flowKey: string;
    trackKey: string;

    top: number;
    left: number;
    width: number;
    color: string;
    selected: boolean;
    tool: Tool;

    onEdit: (
        e: PointerEvent<HTMLElement>,
        tone: Entry<Tone>,
        fixedStart: boolean,
        fixedDuration: boolean,
        fixedPitch: boolean
    ) => void;
    onPlay: (pitch: Pitch) => void;
}

export const ToneElement: FC<Props> = ({ flowKey, trackKey, tone, selected, color, top, left, width, tool, onEdit, onPlay }) => {
    const actions = useAppActions();
    const theme = useAppState(s => s.ui.theme.pallets);

    const fill = useMemo(() => {
        if (selected) {
            return theme.highlight;
        } else {
            return color;
        }
    }, [color, theme.highlight, selected]);

    const border = useMemo(() => {
        if (selected) {
            return Color(theme.highlight).darken(0.2).toString();
        } else {
            return Color(color).darken(0.5).toString();
        }
    }, [color, theme.highlight, selected]);

    const select = useCallback(
        (e: PointerEvent) => {
            if (tool === Tool.select) {
                // stop the deselect event listener on .instrument-track from firing
                e.stopPropagation();
                actions.ui.selection[TabState.play].clear();
                actions.ui.selection[TabState.play].select(tone._key);
                if (!selected) {
                    onPlay(tone.pitch);
                }
            }

            if (tool === Tool.eraser) {
                actions.ui.selection[TabState.play].deselect(tone._key);
                actions.score.instruments.removeTone(flowKey, trackKey, tone._key);
            }
        },
        [flowKey, trackKey, tool, onPlay, selected, actions.score.instruments, actions.ui.selection, tone._key, tone.pitch]
    );

    const actionWest = useCallback(
        (e: PointerEvent<HTMLElement>) => onEdit(e, tone, false, false, true),
        [tone, onEdit]
    );
    const action = useCallback(
        (e: PointerEvent<HTMLElement>) => onEdit(e, tone, false, true, false),
        [tone, onEdit]
    );
    const actionEast = useCallback(
        (e: PointerEvent<HTMLElement>) => onEdit(e, tone, true, false, true),
        [tone, onEdit]
    );

    return (
        <div
            key={tone._key}
            className="tone no-scroll"
            style={{
                border: `1px solid ${border}`,
                outline: selected ? `1px solid ${border}` : undefined,
                backgroundColor: fill,
                top,
                left,
                width,
                height: SLOT_HEIGHT
            }}
            onPointerDown={select}
        >
            {tool === Tool.select && (
                <>
                    <div className="tone__handle tone__handle--w" onPointerDown={actionWest} />
                    <div className="tone__handle tone__handle--move" onPointerDown={action} />
                    <div className="tone__handle tone__handle--e" onPointerDown={actionEast} />
                </>
            )}
        </div>
    );
};
