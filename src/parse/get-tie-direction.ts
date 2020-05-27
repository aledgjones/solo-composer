import { Direction } from "./get-stem-direction";
import { Notation } from "./notation-track";

export interface TieDirectionsByKey {
    [toneKey: string]: Direction;
}

export function getTieDirection(entry: Notation, stemDirection: Direction) {
    // no ties, don't process
    if (entry.ties.length === 0) {
        return entry.tones.reduce<TieDirectionsByKey>((out, tone) => {
            out[tone._key] = Direction.none;
            return out;
        }, {});
    }

    // check clusters ----- even without a tie - these will affect tied notes

    // no clusters go to basic tie directions

    return entry.tones.reduce<TieDirectionsByKey>((out, tone) => {
        const tieIndex = entry.ties.indexOf(tone._key);
        if (tieIndex < 0) {
            out[tone._key] = Direction.none;
        } else {
            const count = entry.ties.length;
            if (count === 1) {
                out[tone._key] = Direction.up ? Direction.down : Direction.up;
            } else {
                let middle = 0;
                // majority away from stem
                if (stemDirection === Direction.up) {
                    middle = Math.ceil(count / 2);
                } else {
                    middle = Math.floor(count / 2);
                }
                if (tieIndex < middle) {
                    out[tone._key] = Direction.down;
                } else {
                    out[tone._key] = Direction.up;
                }
            }
        }
        return out;
    }, {});
}
