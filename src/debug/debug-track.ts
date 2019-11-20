import { Flow } from "../services/flow";
import { DurationType, RhythmTrack } from "../parse/rhythm-track";

export function debugTrack(flow: Flow, track: RhythmTrack) {
    let rests = '';
    const output: { [key: string]: string } = {};
    for (let tick = 0; tick < flow.length; tick++) {
        const entry = track[tick];
        if (entry) {
            switch (entry.type) {
                case DurationType.note: {
                    entry.keys.forEach((key) => {
                        if (!output[key]) {
                            output[key] = '';
                        }
                        const fill = Array(tick - output[key].length).fill(' ').join('');
                        output[key] += fill + 'o';
                        if (entry.ties.includes(key)) {
                            output[key] += Array(entry.duration - 1).fill('_').join('');
                        } else {
                            output[key] += Array(entry.duration - 2).fill('-').join('') + '¬';
                        }
                    });
                    break;
                }
                case DurationType.rest: {
                    const fill = Array(tick - rests.length).fill(' ').join('');
                    rests += fill + 'r';
                    rests += Array(entry.duration - 2).fill('-').join('') + '¬';
                    break;
                }
                default:
                    break;
            }
        }

    }

    console.log(rests);
    const keys = Object.keys(output);
    keys.forEach(key => {
        console.log(output[key]);
    });
}