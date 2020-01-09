import { Patches } from "./sampler";
import { Pitch } from "./patch-player";

export enum OutputType {
    midi = 1,
    sampler
}

export type Action = { type: string, payload: any };
export type Listener = (action: Action) => void;
export type ChannelKey = string;

/**
 * An abstract class that defines either a midi or sampler interface
 */
export interface Output {
    id: string;
    name: string;
    type: OutputType;
    manufacturer: string;

    load: (channel: ChannelKey, patchUrls: Patches, patchName: string) => void;
    // gain: (channel: number, gain: number) => void;
    play: (channel: ChannelKey, patch: string, pitch: Pitch, velocity: number, duration: number, when?: number) => void;
    stopAll: () => void;
    
    listen: (cb: Listener) => void;
}