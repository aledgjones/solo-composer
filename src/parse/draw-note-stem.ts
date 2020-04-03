import { buildPath } from '../render/path';
import { StemDirection } from './get-stem-direction';
import { ToneDetails } from './draw-tick';

export function drawNoteStem(x: number, y: number, tones: ToneDetails[], stemDirection: StemDirection, key: string) {

    // tones are sorted by pitch asc so we take first and last for lowest & highest pitch
    const lowest = tones[0];
    const highest = tones[tones.length - 1];

    const noteheadOffsetForStem = 0.1;
    if (stemDirection === StemDirection.up) {

        const length = highest.offset > 11 ? (highest.offset / 2) - 2 : 3.5;

        return buildPath(key, { color: '#000000', thickness: .125 },
            [x + 1.115, y + (lowest.offset / 2) - noteheadOffsetForStem],
            [x + 1.115, y + ((highest.offset / 2) - noteheadOffsetForStem) - (length - noteheadOffsetForStem)]
        );
    }

    if (stemDirection === StemDirection.down) {

        const length = lowest.offset < -3 ? 2 - (lowest.offset / 2) : 3.5;

        return buildPath(key, { color: '#000000', thickness: .125 },
            [x + 0.0625, y + (highest.offset / 2) + noteheadOffsetForStem],
            [x + 0.0625, y + (lowest.offset / 2) + noteheadOffsetForStem + (length - noteheadOffsetForStem)],
        );
    }
}