import React, { FC } from 'react';
import Color from 'color';

import { Instrument } from '../../services/instrument';
import { background } from './track-background';
import { Tick } from './ticks';
import { Staves } from '../../services/stave';
import { EntryType, Entry } from '../../entries';
import { Tone } from '../../entries/tone';
import { getMIDIPitchValue, C0 } from '../../entries/tone';

import './instrument-track.css';

interface Props {
    color: string;
    instrument: Instrument;
    staves: Staves;
    ticks: Tick[];
}

function getTop(pitch: string, offset: number, slotHeight: number) {
    const value = getMIDIPitchValue(pitch);
    return (16 - (value - (C0 + offset))) * slotHeight;
}

function getWidth(start: number, duration: number, ticks: Tick[]) {
    let width = 0;
    for (let i = start; i < start + duration; i++) {
        width += ticks[i].width;
    }
    return width;
}

export const InstrumentTrack: FC<Props> = ({ color, instrument, staves, ticks }) => {

    return < div className="instrument-track" style={{ backgroundImage: background }}>
        {instrument.staves.map(staveKey => {
            const stave = staves[staveKey];
            return stave.tracks.order.map(trackKey => {
                const track = stave.tracks.byKey[trackKey];
                return track.entries.order.map(entryKey => {
                    if (track.entries.byKey[entryKey]._type === EntryType.tone) {
                        const entry = track.entries.byKey[entryKey] as Entry<Tone>;
                        const slot = 224 / 24;
                        const top = getTop(entry.pitch, 48, slot);
                        const left = ticks[entry._tick].x;
                        const width = getWidth(entry._tick, entry.duration, ticks);
                        return <div key={entry._key} className="instrument-track__tone" style={{ backgroundColor: color, top, left, height: slot, width }} />;
                    }
                });
            });
        })}
    </div >;
}

