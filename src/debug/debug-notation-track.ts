import { NotationTrack } from "../parse/notation-track";
import { getIsRest } from "../parse/is-rest";

export function debugNotationTrack(len: number, track: NotationTrack) {
    let output = '';

    for (let tick = 0; tick < len; tick++) {
        const event = track[tick];
        if (event) {
            if (getIsRest(event)) {
                output += 'r' + Array(event.duration - 2).fill('-').join('') + '¬';
            } else {
                output += 'o';
                if (event.ties.length > 0) {
                    output += Array(event.duration - 1).fill('_').join('');
                } else {
                    output += Array(event.duration - 2).fill('-').join('') + '¬';
                }
            }
        }
    }

    return output;
}