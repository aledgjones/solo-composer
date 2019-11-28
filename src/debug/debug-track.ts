import { NotationType, NotationTrack } from "../parse/notation-track";

export function debugTrack(length: number, track: NotationTrack) {

    const output: { rests: string[], [key: string]: string[] } = { rests: [] };
    for (let tick = 0; tick < length; tick++) {
        const entry = track[tick];
        if (entry) {
            switch (entry.type) {
                case NotationType.note: {
                    entry.keys.forEach((key) => {
                        if (!output[key]) {
                            output[key] = [];
                        }
                        output[key].push(...Array(tick - output[key].length).fill(' '));
                        output[key].push('o');
                        if (entry.ties.includes(key)) {
                            output[key].push(...Array(entry.duration - 1).fill('_'));
                        } else {
                            output[key].push(...Array(entry.duration - 2).fill('-'))
                            output[key].push('¬');
                        }
                    });
                    break;
                }
                case NotationType.rest: {
                    output['rests'].push(...Array(tick - output['rests'].length).fill(' '));
                    output['rests'].push('r');
                    output['rests'].push(...Array(entry.duration - 2).fill('-'))
                    output['rests'].push('¬');
                    break;
                }
                default:
                    break;
            }
        }

    }


    const log: string[] = [];
    const keys = Object.keys(output);
    for (let tick = 0; tick < length; tick++) {
        keys.forEach(key => {
            const char = output[key][tick];
            if (!log[tick] || log[tick] === ' ' || char === 'r' || char === 'o') {
                log[tick] = char;
            }
        });
    }
    return log.join('');

}