import shortid from 'shortid';
import { StaveDef } from "./instrument-defs";
import { Track, createTrack, Tracks } from './track';
import { createClef } from '../entries/clef';
import { Instrument } from './instrument';
import { Flow } from './flow';
import { createTone } from '../entries/tone';
import { Entry } from '../entries';

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

    const events: Entry<any>[] = [
        createTone({ duration: 6, pitch: 'C#4' }, 0),
        createTone({ duration: 12, pitch: 'D4' }, 6),
        createTone({ duration: 24, pitch: 'E4' }, 18),
        createTone({ duration: 6, pitch: 'F4' }, 42),
        createTone({ duration: 6, pitch: 'B3' }, 48),
        createTone({ duration: 6, pitch: 'C4' }, 60),
        createTone({ duration: 9, pitch: 'D4' }, 108),
        createTone({ duration: 27, pitch: 'E4' }, 117)
    ];
    const primary = createTrack(events);

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