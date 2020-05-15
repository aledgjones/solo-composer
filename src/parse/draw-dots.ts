import { ToneDetails } from "./draw-tick";
import { CircleStyles, buildCircle } from "../render/circle";
import { NotationBaseDuration } from "./notation-track";
import { getNoteheadWidthFromDuration } from "./get-notehead-width-from-duration";
import { Direction } from "./get-stem-direction";
import { getDotSlots } from "./get-dot-slots";

export function drawDots(
    x: number,
    y: number,
    details: ToneDetails[],
    duration: NotationBaseDuration | undefined,
    stemDirection: Direction,
    hasShunts: boolean,
    key: string
) {
    const instructions: any = [];

    // left
    const width = getNoteheadWidthFromDuration(duration);
    const offsetLeft = (stemDirection === Direction.up && hasShunts ? width * 2 : width) + 0.6;

    // create a lookup for each slot that already has a dot in it
    const slots = getDotSlots(details);

    Object.keys(slots).map((slot) => {
        // slot is the offset of the slot we can use to draw the y position
        const styles: CircleStyles = { color: "#000000" };
        instructions.push(buildCircle(`${key}-${slot}`, styles, x + offsetLeft, y + parseFloat(slot) / 2, 0.225));
    });

    return instructions;
}
