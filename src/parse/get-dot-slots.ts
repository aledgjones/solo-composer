import { ToneDetails } from "./draw-tick";

function isCloseEnough(slot: number, details: ToneDetails[]) {
    for (let i = 0; i < details.length; i++) {
        const offset = details[i].offset;
        if (slot >= offset - 2 && slot <= offset + 2) {
            return true;
        }
    }

    return false;
}

function allDotsDrawnApproach(details: ToneDetails[]) {
    const slots: { [slot: number]: boolean } = {};

    details.forEach((tone) => {
        const isSpace = tone.offset % 2 !== 0;
        if (isSpace) {
            slots[tone.offset] = true;
        }
    });

    for (let i = details.length - 1; i >= 0; i--) {
        const tone = details[i];
        const isLine = tone.offset % 2 === 0;
        if (isLine) {
            let n = 0;
            let direction = -1;
            let slot = tone.offset + (1 + n * 2) * direction;
            // zig zag out from the note keep going until you find the closest empty slot
            while (slots[slot] === true) {
                if (direction === 1) {
                    n++;
                }
                direction = direction * -1;
                slot = tone.offset + (1 + n * 2) * direction;
            }
            // if the slot is only 1 space away from the chord we can add a dot
            if (isCloseEnough(slot, details)) {
                slots[slot] = true;
            } else {
                // if you can't fit the dot close enough to the end
                // of the cluster try moving it to the other end
                direction = direction * -1;
                do {
                    slot = slot + 2 * direction;
                } while (slots[slot] === true);
                if (isCloseEnough(slot, details)) {
                    slots[slot] = true;
                } else {
                    // we can't draw the dot close enough so we can bail out here.
                    return null;
                }
            }
        }
    }
    return slots;
}

function tightlySpacedDotsApproach(details: ToneDetails[]) {
    const slots: { [slot: number]: boolean } = {};
    details.forEach((tone) => {
        const isSpace = tone.offset % 2 !== 0;
        if (isSpace) {
            slots[tone.offset] = true;
        }
    });

    details.forEach((tone) => {
        const isLine = tone.offset % 2 === 0;
        if (isLine) {
            if (!slots[tone.offset - 1]) {
                slots[tone.offset - 1] = true;
            } else {
                slots[tone.offset + 1] = true;
            }
        }
    });
    return slots;
}

export function getDotSlots(details: ToneDetails[]) {
    const slots = allDotsDrawnApproach(details);
    if (slots === null) {
        // if you can't fit all the dots close enough we revert to a tighter approach
        return tightlySpacedDotsApproach(details);
    } else {
        return slots;
    }
}
