import shortid from 'shortid';
import { StaveDef } from "./instrument-defs";
import { Track, createTrack, TrackKey, Tracks } from './track';
import { createClef } from '../entries/clef';
import { Instrument } from './instrument';
import { Flow } from './flow';
import { createTone } from '../entries/tone';

export type StaveKey = string;

export type Staves = { [staveKey: string]: Stave };

export interface Stave {
    key: StaveKey;
    lines: number;
    master: Track;
    tracks: Tracks;
}

export function createStave(staveDef: StaveDef, staveKey: StaveKey = shortid()): Stave {
    const clef = createClef(staveDef.clef, 0);
    const master = createTrack([clef._key], { [clef._key]: clef });

    // remove next after debug
    const tones = [
        // createTone({ duration: 24 }, 0),
        createTone({ duration: 12 }, 0),
        createTone({ duration: 24 }, 36),
        createTone({ duration: 12 }, 42)
    ];
    const track = createTrack(
        tones.map(tone => tone._key),
        tones.reduce((out: any, tone) => {
            out[tone._key] = tone;
            return out;
        }, {})
    );

    return {
        key: staveKey,
        lines: staveDef.lines,
        master,
        tracks: {
            order: [track.key],
            byKey: {
                [track.key]: track
            }
        }
    }
}

export function getStaves(instruments: Instrument[], flow: Flow) {
    return instruments.reduce((output: Stave[], instrument) => {
        instrument.staves.forEach(staveKey => {
            output.push(flow.staves[staveKey]);
        });
        return output;
    }, []);
}