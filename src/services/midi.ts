import webMidi, { Input, Output } from "webmidi";
import { Store } from "pullstate";
import { State } from "./state";

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

export const midiActions = (store: Store<State>) => {
    return {
        init: () => {
            webMidi.enable(function (err) {
                const update = () => {
                    store.update(s => {
                        s.playback.midi = {
                            inputs: webMidi.inputs,
                            outputs: webMidi.outputs
                        }
                    });
                }
                webMidi.addListener('connected', update);
                webMidi.addListener('disconnected', update);
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