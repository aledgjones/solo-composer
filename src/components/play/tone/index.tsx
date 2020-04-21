import React, { FC, useMemo } from 'react';
import Color from 'color';

import { Tool, TabState } from '../../../services/ui';
import { SLOT_HEIGHT } from '../instrument-track/get-tone-dimension';
import { useAppActions } from '../../../services/state';

import './styles.css';

interface Props {
    flowKey: string;
    trackKey: string;
    toneKey: string;

    top: number;
    left: number;
    width: number;
    color: string;
    selected: boolean;
    tool: Tool;
}

export const ToneElement: FC<Props> = ({ flowKey, trackKey, toneKey, selected, color, top, left, width, tool }) => {

    const actions = useAppActions();

    const fill = useMemo(() => {
        if (selected) {
            return Color(color).lighten(.8).toString();
        } else {
            return color;
        }
    }, [color, selected]);

    const border = useMemo(() => {
        if (selected) {
            return `1px solid ${color}`;
        } else {
            const c = Color(color).darken(.5).toString();
            return `1px solid ${c}`;
        }
    }, [color, selected]);

    return <div
        key={toneKey}
        className="tone no-scroll"
        style={{
            border,
            backgroundColor: fill,
            top,
            left,
            width,
            height: SLOT_HEIGHT
        }}
        onPointerDown={e => {
            if (tool === Tool.select) {
                // stop the delect event listener on .instrument-track from firing
                e.stopPropagation();
                if (!e.ctrlKey) {
                    actions.ui.selection[TabState.play].clear();
                }
                actions.ui.selection[TabState.play].toggle(toneKey);
            }

            if (tool === Tool.eraser) {
                actions.ui.selection[TabState.play].deselect(toneKey);
                actions.score.instruments.removeTone(flowKey, trackKey, toneKey);
            }
        }}
    >
        {tool === Tool.select && <>
            <div className="tone__handle tone__handle--w" />
            <div className="tone__handle tone__handle--e" />
        </>}
    </div>;
}