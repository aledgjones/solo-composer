import React, { FC, useCallback, PointerEvent, useState, useEffect } from 'react';
import Color from 'color';

import { merge } from 'solo-ui';

import { TabState, Tool } from '../../../services/ui';
import { useAppState, useAppActions } from '../../../services/state';
import { FlowKey } from '../../../services/flow';
import { Instrument } from '../../../services/instrument';
import { Staves } from '../../../services/stave';
import { Tracks } from '../../../services/track';
import { getToneDimensions, SLOT_HEIGHT } from './get-tone-dimension';
import { toMidiPitchString, toMidiPitchNumber } from '../../../playback/utils';
import { THEME } from '../../../const';
import { EntryType, Entry } from '../../../entries';
import { Tone } from '../../../entries/tone';
import { trackBackground } from './track-background';
import { Tick } from '../ticks/defs';

import './styles.css';


interface Props {
    flowKey: FlowKey;
    color: string;
    instrument: Instrument;
    staves: Staves;
    tracks: Tracks;
    ticks: Tick[];
}

function getPitchFromYPosition(y: number, highestPitch: number, slotHeight: number) {
    const base = highestPitch;
    const slot = Math.floor(y / slotHeight);
    return toMidiPitchString(base - slot);
}

function getTickFromXPosition(x: number, ticks: Tick[], snap: number, forceFloor: boolean) {
    for (let i = 0; i < ticks.length; i++) {
        const tick = ticks[i];
        if (tick.x > x) {

            // when we first create a tone we want the X position to always be on the low edge of the snap
            const roundDown = tick.x / tick.width <= .5 || forceFloor;
            if (roundDown) {
                return Math.floor((i - 1) / snap) * snap;
            } else {
                return Math.ceil((i - 1) / snap) * snap;
            }

        }
    }
    return 0;
}

export const InstrumentTrack: FC<Props> = ({ color, instrument, staves, tracks, ticks, flowKey }) => {

    const tool = useAppState(s => s.ui.tool[TabState.play]);
    const actions = useAppActions();

    const border = useCallback((selected: boolean) => {
        const c = Color(selected ? THEME.highlight[500] : color).darken(.5).toString();
        return `1px solid ${c}`;
    }, [color]);

    const snap = 3; // this need to be generated based on the subdevisions (3/12 === semi-quaver)
    const highestPitch = toMidiPitchNumber('E5');

    const [selection, setSelection] = useState<string>();

    const startWrite = useCallback((e: PointerEvent<HTMLDivElement>) => {

        if (tool === Tool.select) {
            setSelection(undefined);
        }

        if (tool === Tool.pencil) {

            setSelection(undefined);

            const staveKey = instrument.staves[0];
            const trackKey = staves[staveKey].tracks[0];

            const box = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - box.left;
            const y = e.clientY - box.top;
            const pitch = getPitchFromYPosition(y, highestPitch, SLOT_HEIGHT);
            const start = getTickFromXPosition(x, ticks, snap, true);
            const toneKey = actions.score.instruments.createTone(flowKey, trackKey, { pitch, duration: snap }, start);

            setSelection(toneKey);

            const move = (e: any) => {
                const x = e.clientX - box.left;
                const duration = getTickFromXPosition(x, ticks, snap, false) - start;
                actions.score.instruments.updateTone(flowKey, trackKey, toneKey, { duration: duration >= snap ? duration : snap });
            }

            const end = (e: any) => {
                window.removeEventListener('pointermove', move);
                window.removeEventListener('pointerup', end);
            }

            window.addEventListener('pointermove', move, { passive: true });
            window.addEventListener('pointerup', end, { passive: true });

        }

    }, [ticks, flowKey, highestPitch, instrument.staves, staves, tool, actions.score.instruments]);

    return <div className={merge("instrument-track", { 'no-scroll': tool !== Tool.hand })} onPointerDown={startWrite} style={{ backgroundImage: trackBackground }}>
        {instrument.staves.map(staveKey => {
            const stave = staves[staveKey];
            return stave.tracks.map(trackKey => {
                const track = tracks[trackKey];
                return track.entries.order.map(entryKey => {
                    if (track.entries.byKey[entryKey]._type === EntryType.tone) {

                        const entry = track.entries.byKey[entryKey] as Entry<Tone>;
                        const selected = entry._key === selection;
                        const [top, left, width] = getToneDimensions(highestPitch, entry, ticks);

                        return <div
                            key={entry._key}
                            className="instrument-track__tone"
                            style={{
                                border: border(selected),
                                backgroundColor: selected ? THEME.highlight[500] : color,
                                top,
                                left,
                                height: SLOT_HEIGHT,
                                width
                            }}
                            onPointerDown={e => {
                                if (tool === Tool.select) {
                                    setSelection(entry._key);
                                }
                                e.stopPropagation();
                            }}
                        />;
                    } else {
                        return null;
                    }
                });
            });
        })}
    </div >;
}

