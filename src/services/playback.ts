import { Store } from "pullstate";
import { State } from "./state";

import { MidiState, midiEmptyState, midiActions } from "./midi";
import { SamplerState, samplerEmptyState, samplerActions } from "./sampler";

export interface PlaybackState {
    playing: boolean;
    tick: number;
    midi: MidiState;
    sampler: SamplerState;
    settings: {
        audition: boolean;
    }
}

export const playbackEmptyState = (): PlaybackState => {
    return {
        playing: false,
        tick: 0,
        midi: midiEmptyState(),
        sampler: samplerEmptyState(),
        settings: {
            audition: true
        }
    };
}

export const playbackActions = (store: Store<State>) => {
    return {
        midi: midiActions(store),
        sampler: samplerActions(store),
        settings: {
            audition: {
                toggle: () => {
                    store.update(s => {
                        s.playback.settings.audition = !s.playback.settings.audition;
                    });
                }
            }
        }
    }
}