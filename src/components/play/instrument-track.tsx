import React, { FC, useCallback, PointerEvent, useState, useMemo } from 'react';

import { Instrument } from '../../services/instrument';
import { background } from './track-background';
import { Tick } from './ticks';
import { Staves } from '../../services/stave';
import { EntryType, Entry } from '../../entries';
import { Tone } from '../../entries/tone';
import { toMidiPitchNumber, Pitch, toMidiPitchString } from '../../playback/utils';
import { Tracks } from '../../services/track';
import { useAppActions } from '../../services/state';
import { FlowKey } from '../../services/flow';
import Color from 'color';

import './instrument-track.css';

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

    const actions = useAppActions();

    const border = useMemo(() => {
        const c = Color(color).darken(.5).toString();
        return `1px solid ${c}`;
    }, [color]);

    const snap = 3;
    const slotHeight = 224 / 24;
    const highestPitch = toMidiPitchNumber('E5');

    const [newbie, setNewbie] = useState<{ pitch: string, start: number, duration: number }>();

    const startWrite = useCallback((e: PointerEvent<HTMLDivElement>) => {
        const box = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - box.left;
        const y = e.clientY - box.top;
        const pitch = getPitchFromYPosition(y, highestPitch, slotHeight);
        const start = getTickFromXPosition(x, ticks, snap, true);

        setNewbie({ pitch, start, duration: snap });

        const move = (e: any) => {
            const x = e.clientX - box.left;
            const duration = getTickFromXPosition(x, ticks, snap, false) - start;
            if (duration >= snap) {
                setNewbie(pre => {
                    if (pre) {
                        return { ...pre, duration }
                    } else {
                        return undefined;
                    }
                });
            }
        }

        const end = (e: any) => {
            const x = e.clientX - box.left;
            const duration = getTickFromXPosition(x, ticks, snap, false) - start;
            if (duration >= snap) {
                const staveKey = instrument.staves[0];
                const trackKey = staves[staveKey].tracks[0];
                actions.score.instruments.createTone(flowKey, trackKey, { pitch, duration }, start);
            }
            setNewbie(undefined);
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', end);
        }

        window.addEventListener('pointermove', move, { passive: true });
        window.addEventListener('pointerup', end, { passive: true });

    }, [ticks, flowKey, highestPitch, instrument.staves, slotHeight, staves, actions.score.instruments]);

    return <div className="instrument-track no-scroll" onPointerDown={startWrite} style={{ backgroundImage: background }}>
        {instrument.staves.map(staveKey => {
            const stave = staves[staveKey];
            return stave.tracks.map(trackKey => {
                const track = tracks[trackKey];
                return track.entries.order.map(entryKey => {
                    if (track.entries.byKey[entryKey]._type === EntryType.tone) {
                        const entry = track.entries.byKey[entryKey] as Entry<Tone>;
                        const left = ticks[entry._tick].x;
                        const top = getTop(entry.pitch, highestPitch, slotHeight);
                        const width = getWidth(entry._tick, entry.duration, ticks);
                        return <div key={entry._key} className="instrument-track__tone" style={{ border, backgroundColor: color, top, left, height: slotHeight, width }} />;
                    } else {
                        return null;
                    }
                });
            });
        })}

        {newbie && <div key="newbie" className="instrument-track__tone" style={{ border, backgroundColor: color, top: getTop(newbie.pitch, highestPitch, slotHeight), left: ticks[newbie.start].x, height: slotHeight, width: getWidth(newbie.start, newbie.duration, ticks) }} />}
    </div >;
}

