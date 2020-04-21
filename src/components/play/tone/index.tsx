import React, { FC, useMemo, useCallback, PointerEvent } from 'react';
import Color from 'color';

import { THEME } from '../../../const';
import { Tool, TabState } from '../../../services/ui';
import { SLOT_HEIGHT } from '../instrument-track/get-tone-dimension';
import { useAppActions } from '../../../services/state';
import { Tone } from '../../../entries/tone';
import { Entry } from '../../../entries';

import './styles.css';

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

    onEdit: (e: PointerEvent, tone: Entry<Tone>, fixedStart: boolean, fixedDuration: boolean, fixedPitch: boolean) => void;
}

export const ToneElement: FC<Props> = ({ flowKey, trackKey, tone, selected, color, top, left, width, tool, onEdit }) => {

    const actions = useAppActions();

    const border = useMemo(() => {
        if (selected) {
            return `1px solid ${THEME.highlight[500]}`;
        } else {
            const c = Color(color).darken(.5).toString();
            return `1px solid ${c}`;
        }
    }, [color, selected]);

    const select = useCallback((e: PointerEvent) => {
        if (tool === Tool.select) {
            // stop the delect event listener on .instrument-track from firing
            e.stopPropagation();
            // if (!e.ctrlKey) {
            actions.ui.selection[TabState.play].clear();
            // }
            actions.ui.selection[TabState.play].toggle(tone._key);
        }

        if (tool === Tool.eraser) {
            actions.ui.selection[TabState.play].deselect(tone._key);
            actions.score.instruments.removeTone(flowKey, trackKey, tone._key);
        }
    }, [flowKey, trackKey, tool, actions.score.instruments, actions.ui.selection, tone._key]);

    const actionWest = useCallback((e: PointerEvent) => onEdit(e, tone, false, false, true), [tone, onEdit]);
    const action = useCallback((e: PointerEvent) => onEdit(e, tone, false, true, false), [tone, onEdit]);
    const actionEast = useCallback((e: PointerEvent) => onEdit(e, tone, true, false, true), [tone, onEdit]);

    return <div
        key={tone._key}
        className="tone no-scroll"
        style={{
            border,
            outline: selected ? `1px solid ${THEME.highlight[500]}` : undefined,
            backgroundColor: color,
            top,
            left,
            width,
            height: SLOT_HEIGHT
        }}
        onPointerDown={select}
    >
        {tool === Tool.select && <>
            <div className="tone__handle tone__handle--w" onPointerDown={actionWest} />
            <div className="tone__handle tone__handle--move" onPointerDown={action} />
            <div className="tone__handle tone__handle--e" onPointerDown={actionEast} />
        </>}
    </div>;
}