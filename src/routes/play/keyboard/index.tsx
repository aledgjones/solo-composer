import React, { FC } from "react";

import { useDragHandler } from "solo-ui";

import { SLOT_HEIGHT } from "../instrument-track/get-tone-dimension";
import { InstrumentKey } from "../../../services/score-instrument";
import { useAppState, useAppActions } from "../../../services/state";
import { useKeyboardBackground } from "./keyboard-background";

import "./styles.css";

const OCTAVES = [0, 1, 2, 3, 4, 5, 6, 7, 8];

interface Props {
    instrumentKey: InstrumentKey;
}

export const Keyboard: FC<Props> = ({ instrumentKey }) => {
    const offset = useAppState(s => s.ui.pianoRollOffsetY[instrumentKey] || 0, [instrumentKey]);
    const actions = useAppActions();
    const background = useKeyboardBackground();

    const onDrag = useDragHandler<{ y: number; offset: number }>(
        {
            onDown: e => {
                return {
                    y: e.screenY,
                    offset: offset
                };
            },
            onMove: (e, init) => {
                const change = Math.round((init.y - e.screenY) / SLOT_HEIGHT);
                actions.ui.pianoRollOffsetY.set(instrumentKey, init.offset - change);
            },
            onEnd: () => { }
        },
        [offset, actions.ui.pianoRollOffsetY, instrumentKey]
    );

    return (
        <div
            onPointerDown={onDrag}
            className="keyboard"
            style={{
                backgroundImage: background,
                backgroundPositionY: (offset * SLOT_HEIGHT) + .5,
                backgroundSize: '100% 120px, 60% 120px'
            }}
        >
            <div style={{ transform: `translateY(${offset * SLOT_HEIGHT}px)` }}>
                {OCTAVES.map(octave => {
                    return (
                        <p
                            key={octave}
                            className="keyboard__name keyboard__name"
                            style={{
                                transform: `translateY(${SLOT_HEIGHT * -12 * (octave - 5)}px)`
                            }}
                        >
                            C{octave}
                        </p>
                    );
                })}
            </div>
        </div>
    );
};
