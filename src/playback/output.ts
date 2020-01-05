import { Patches } from "./sampler";

export enum OutputType {
    midi = 1,
    sampler
}

export type Action = { type: string, payload: any };
export type Listener = (action: Action) => void;

/**
 * An abstract class that defines either a midi or sampler interface
 */
export interface Output {
    id: string;
    name: string;
    type: OutputType;
    manufacturer: string;

    load: (channel: string, patchUrls: Patches, patchName: string) => void;
    // gain: (channel: number, gain: number) => void;
    // play: (channel: number, patch: string, pitch: Pitch, velocity: number, duration: number, when?: number) => void;

    listen: (cb: Listener) => void;
}