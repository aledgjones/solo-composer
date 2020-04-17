import React, { FC, useCallback, PointerEvent, useState, useEffect } from 'react';
import Color from 'color';

import { merge } from 'solo-ui';

import { THEME } from '../../const';
import { TabState, Tool } from '../../services/ui';
import { Instrument } from '../../services/instrument';
import { background } from './track-background';
import { Tick } from './ticks';
import { Staves } from '../../services/stave';
import { EntryType, Entry } from '../../entries';
import { Tone } from '../../entries/tone';
import { toMidiPitchNumber, Pitch, toMidiPitchString } from '../../playback/utils';
import { Tracks } from '../../services/track';
import { useAppActions, useAppState } from '../../services/state';
import { FlowKey } from '../../services/flow';

import './instrument-track.css';

const SLOT_HEIGHT = 224 / 24;

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

function getTop(pitch: Pitch, highestPitch: number, slotHeight: number) {
    const value = toMidiPitchNumber(pitch);
    return (highestPitch - value) * slotHeight;
}

function getWidth(start: number, duration: number, ticks: Tick[]) {
    let width = 0;
    for (let i = start; i < start + duration; i++) {
        width += ticks[i].width;
    }
    return width;
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

    /**
     * Global key commands
     */
    useEffect(() => {

        const listener = (e: KeyboardEvent) => {
            if (selection) {

                const staveKey = instrument.staves[0];
                const trackKey = staves[staveKey].tracks[0];

                switch (e.key) {
                    case 'Delete':
                        actions.score.instruments.removeTone(flowKey, trackKey, selection);
                        setSelection(undefined);
                        break;
                    default:
                        break;
                }
            }
        }

        window.addEventListener('keypress', listener);
        return () => {
            window.removeEventListener('keypress', listener);
        }

    }, [actions.score.instruments, flowKey, instrument.staves, staves, selection]);

    const startWrite = useCallback((e: PointerEvent<HTMLDivElement>) => {

        if (tool === Tool.select) {
            setSelection(undefined);
        }

        if (tool === Tool.pencil) {

            setSelection(undefined);

            const box = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - box.left;
            const y = e.clientY - box.top;
            const pitch = getPitchFromYPosition(y, highestPitch, SLOT_HEIGHT);
            const start = getTickFromXPosition(x, ticks, snap, true);
            const staveKey = instrument.staves[0];
            const trackKey = staves[staveKey].tracks[0];
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

    return <div className={merge("instrument-track", { 'no-scroll': tool !== Tool.hand })} onPointerDown={startWrite} style={{ backgroundImage: background }}>
        {instrument.staves.map(staveKey => {
            const stave = staves[staveKey];
            return stave.tracks.map(trackKey => {
                const track = tracks[trackKey];
                return track.entries.order.map(entryKey => {
                    if (track.entries.byKey[entryKey]._type === EntryType.tone) {

                        const entry = track.entries.byKey[entryKey] as Entry<Tone>;
                        const left = ticks[entry._tick].x;
                        const top = getTop(entry.pitch, highestPitch, SLOT_HEIGHT);
                        const width = getWidth(entry._tick, entry.duration, ticks);
                        const selected = entry._key === selection;

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

