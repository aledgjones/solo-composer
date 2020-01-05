import webMidi, { Input, Output } from "webmidi";

export const MIDI_SET_CONNECTIONS = '@midi/set-connections';

export interface MidiActions {
    init: () => void;
    test: (id: string) => void;
}

export interface MidiState {
    inputs: Input[];
    outputs: Output[];
}

export const midiEmptyState = (): MidiState => {
    return {
        inputs: [],
        outputs: []
    };
}

export const midiReducer = (state: MidiState, action: any) => {
    switch (action.type) {
        case MIDI_SET_CONNECTIONS:
            return {
                ...state,
                inputs: action.payload.inputs,
                outputs: action.payload.outputs
            }
        default:
            return state;
    }
}

export const midiActions = (dispatch: any): MidiActions => {
    return {
        init: () => {
            webMidi.enable(function (err) {
                webMidi.addListener('connected', () => {
                    dispatch({
                        type: MIDI_SET_CONNECTIONS, payload: {
                            inputs: webMidi.inputs,
                            outputs: webMidi.outputs
                        }
                    });
                });

                webMidi.addListener('disconnected', () => {
                    dispatch({
                        type: MIDI_SET_CONNECTIONS, payload: {
                            inputs: webMidi.inputs,
                            outputs: webMidi.outputs
                        }
                    });
                });
            });
        },
        test: (id: string) => {
            const output = webMidi.getOutputById(id);
            if (output) {
                output.playNote('C4', 1, { duration: 100 });
                output.playNote('D4', 1, { duration: 100, time: '+200' });
                output.playNote('E4', 1, { duration: 100, time: '+400' });
                output.playNote('F4', 1, { duration: 100, time: '+600' });
                output.playNote('G4', 1, { duration: 100, time: '+800' });
            }
        }
    }
}