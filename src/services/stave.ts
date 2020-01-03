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
    const primary = createTrack([
        createTone({duration: 12, pitch: 'G3'}, 0),
        createTone({duration: 18, pitch: 'E4'}, 12),
        createTone({duration: 6, pitch: 'D4'}, 30),

        createTone({duration: 12, pitch: 'D4'}, 36),
        createTone({duration: 24, pitch: 'C4'}, 48),

        createTone({duration: 18, pitch: 'G4'}, 90),

        createTone({duration: 3, pitch: 'F4'}, 108),
        createTone({duration: 3, pitch: 'G4'}, 111),
        createTone({duration: 30, pitch: 'F4'}, 114)
    ]);

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