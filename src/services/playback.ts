import { midiEmptyState, MidiState, midiReducer, MidiActions, midiActions } from "./midi";

export const PLAYBACK_LOAD = '@playback/load';

export interface PlaybackActions {
    midi: MidiActions;
}

export interface PlaybackState {
    playing: boolean;
    tick: number;
    midi: MidiState;
}

export const playbackEmptyState = (): PlaybackState => {
    return {
        playing: false,
        tick: 0,
        midi: midiEmptyState()
    };
}

export const playbackReducer = (state: PlaybackState, action: any) => {
    switch (action.type) {
        case PLAYBACK_LOAD:
            return action.payload;
        default:
            return {
                ...state,
                midi: midiReducer(state.midi, action)
            };
    }
}

export const playbackActions = (dispatch: any): PlaybackActions => {
    return {
        midi: midiActions(dispatch)
    }
}