import { Flow } from "../services/flow";
import { RhythmTrack } from "../parse/track-to-written";

export function debugTrack(flow: Flow, track: RhythmTrack) {
    let output = '';
    for (let tick = 0; tick < flow.length; tick++) {
        const entry = track[tick];
        if (entry) {
            output += `${entry.keys.length}`;
        } else {
            output += ' ';
        }

    }
    console.log(output);
}