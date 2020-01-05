import { midiReducer, MidiState, midiEmptyState, MidiActions, midiActions } from "./midi";
import { SamplerActions, SamplerState, samplerEmptyState, samplerReducer, samplerActions } from "./sampler";

export interface PlaybackActions {
    midi: MidiActions;
    sampler: SamplerActions;
}

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

export const playbackReducer = (state: PlaybackState, action: any) => {
    switch (action.type) {
        default:
            return {
                ...state,
                midi: midiReducer(state.midi, action),
                sampler: samplerReducer(state.sampler, action)
            };
    }
}

export const playbackActions = (dispatch: any): PlaybackActions => {
    return {
        midi: midiActions(dispatch),
        sampler: samplerActions(dispatch)
    }
}