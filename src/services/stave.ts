import shortid from 'shortid';
import { StaveDef } from "./instrument-defs";
import { Track, Tracks, TrackKey, createTrack } from './track';
import { Clef, createClef } from './entries/clef';

export type StaveKey = string;

export type Staves = { [staveKey: string]: Stave };

export interface Stave {
    key: StaveKey;
    lines: number;
    master: Track;
}

export function createStave(staveDef: StaveDef, staveKey: StaveKey = shortid()): Stave {
    const clef = createClef(staveDef.clef);
    const master = createTrack([clef._key], { [clef._key]: clef });

    return {
        key: staveKey,
        lines: staveDef.lines,
        master
    }
}