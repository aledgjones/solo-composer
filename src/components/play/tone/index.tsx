import React, { FC, useMemo } from 'react';
import Color from 'color';

import { Tool } from '../../../services/ui';
import { SLOT_HEIGHT } from '../instrument-track/get-tone-dimension';

import './styles.css';
import { THEME } from '../../../const';

interface Props {
    toneKey: string;

    top: number;
    left: number;
    width: number;
    color: string;
    selected: boolean;
    tool: Tool;

    onSelect: (key: string) => void;
    onErase: (key: string) => void;
}

export const ToneElement: FC<Props> = ({ toneKey, selected, color, top, left, width, tool, onSelect, onErase }) => {

    const fill = useMemo(() => {
        if (selected) {
            return Color(color).lighten(.8).toString();
        } else {
            return color;
        }
    }, [color, selected]);

    const border = useMemo(() => {
        if (selected) {
            return `1px solid ${THEME.highlight[500]}`;
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
                onSelect(toneKey);
                // stop the delect event listener on .instrument-track from firing
                e.stopPropagation();
            }
            if (tool === Tool.eraser) {
                onErase(toneKey);
            }
        }}
    >
        {selected && tool === Tool.select && <>
            <div className="tone__handle tone__handle--w" />
            <div className="tone__handle tone__handle--e" />
        </>}
    </div>;
}