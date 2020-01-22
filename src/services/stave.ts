import shortid from 'shortid';
import { StaveDef } from "./instrument-defs";
import { Track, createTrack, Tracks } from './track';
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
    const master = createTrack([clef]);
    const primary = createTrack([createTone({pitch: 'A3', duration: 12 }, 0), createTone({pitch: 'G3', duration: 12 }, 0)]);

    return {
        key: staveKey,
        lines: staveDef.lines,
        master,
        tracks: {
            order: [primary.key],
            byKey: {
                [primary.key]: primary
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