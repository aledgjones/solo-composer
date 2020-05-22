import { Store } from "pullstate";
import { State } from "./state";

import { MidiState, midiEmptyState, midiActions } from "./playback-midi";
import { SamplerState, samplerEmptyState, samplerActions } from "./playback-sampler";

export interface PlaybackState {
    metronome: boolean;
    playing: boolean;
    tick: number;
    midi: MidiState;
    sampler: SamplerState;
}

export const playbackEmptyState = (): PlaybackState => {
    return {
        metronome: false,
        playing: false,
        tick: 0,
        midi: midiEmptyState(),
        sampler: samplerEmptyState()
    };
};

export const playbackActions = (store: Store<State>) => {
    return {
        midi: midiActions(store),
        sampler: samplerActions(store),
        metronome: {
            toggle: () => {
                store.update((s) => {
                    s.playback.metronome = !s.playback.metronome;
                });
            }
        }
    };
};
