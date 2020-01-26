import { Patches } from "./sampler";
import { Pitch } from "./utils";

export enum OutputType {
    midi = 1,
    sampler
}

export type ChannelKey = string;
export type PatchKey = string;

export type OutputProgressCallback = (progress: number) => void;

/**
 * An abstract class that defines either a midi or sampler interface
 */
export interface Output {
    id: string;
    name: string;
    type: OutputType;
    manufacturer: string;

    load: (channel: ChannelKey, patchUrls: Patches, patchName: string, cb: OutputProgressCallback) => void;
    // gain: (channel: number, gain: number) => void;
    play: (channel: ChannelKey, patch: PatchKey, pitch: Pitch, velocity: number, duration: number, when?: number) => void;
    stopAll: () => void;
}