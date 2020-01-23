import { EntryKey, Entries, Entry } from '../entries';
import { buildPath } from '../render/path';
import { Tone } from '../entries/tone';
import { StemDirection, stepsFromTop } from './get stem-direction';
import { Clef } from '../entries/clef-defs';

export function drawNoteStem(x: number, y: number, tones: Entry<Tone>[], clef: Entry<Clef>, stemDirection: StemDirection) {

    // tones are sorted by pitch asc so we take first and last for lowest & highest pitch
    const lowest = tones[0];
    const highest = tones[tones.length - 1];
    const distancesFromTop = [
        stepsFromTop(lowest, clef),
        stepsFromTop(highest, clef)
    ];

    const noteheadOffsetForStem = 0.1;
    if (stemDirection === StemDirection.up) {

        const length = distancesFromTop[1] > 11 ? (distancesFromTop[1] / 2) - 2 : 3.5;

        return buildPath({ color: '#000000', thickness: .125 },
            [x + 1.115, y + (distancesFromTop[0] / 2) - noteheadOffsetForStem],
            [x + 1.115, y + ((distancesFromTop[1] / 2) - noteheadOffsetForStem) - (length - noteheadOffsetForStem)]
        );
    }

    if (stemDirection === StemDirection.down) {

        const length = distancesFromTop[0] < -3 ? 2 - (distancesFromTop[0] / 2) : 3.5;

        return buildPath({ color: '#000000', thickness: .125 },
            [x + 0.0625, y + (distancesFromTop[1] / 2) + noteheadOffsetForStem],
            [x + 0.0625, y + (distancesFromTop[0] / 2) + noteheadOffsetForStem + (length - noteheadOffsetForStem)],

        );
    }
}