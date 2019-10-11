import shortid from 'shortid';
import { StaveDef } from "./instrument-defs";

export type StaveKey = string;

export type Staves = { [staveKey: string]: Stave };

export interface Stave {
    key: StaveKey;
    lines: number;
}

export function createStave(staveDef: StaveDef, staveKey: StaveKey = shortid()): Stave {
    return {
        key: staveKey,
        lines: staveDef.lines
    }
}