import { Store } from "pullstate";
import { State } from "./state";

import { MidiState, midiEmptyState, midiActions } from "./midi";
import { SamplerState, samplerEmptyState, samplerActions } from "./sampler";

export interface PlaybackState {
    playing: boolean;
    tick: number;
    midi: MidiState;
    sampler: SamplerState;
}

export const playbackEmptyState = (): PlaybackState => {
    return {
        playing: false,
        tick: 0,
        midi: midiEmptyState(),
        sampler: samplerEmptyState()
    };
}

export const playbackActions = (store: Store<State>) => {
    return {
        midi: midiActions(store),
        sampler: samplerActions(store)
    }
}