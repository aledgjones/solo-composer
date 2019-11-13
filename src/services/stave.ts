import shortid from 'shortid';
import { StaveDef } from "./instrument-defs";
import { Track, createTrack } from './track';
import { createClef } from '../entries/clef';
import { Instrument } from './instrument';
import { Flow } from './flow';

export type StaveKey = string;

export type Staves = { [staveKey: string]: Stave };

export interface Stave {
    key: StaveKey;
    lines: number;
    master: Track;
}

export function createStave(staveDef: StaveDef, staveKey: StaveKey = shortid()): Stave {
    const clef = createClef(staveDef.clef, 0);
    const master = createTrack([clef._key], { [clef._key]: clef });

    return {
        key: staveKey,
        lines: staveDef.lines,
        master
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