import { getDotSlots } from "./get-dot-slots";
import { createTone } from "../entries/tone";
import { Direction } from "./get-stem-direction";

function generateToneList(offsets: number[]) {
    return offsets.map((offset) => {
        return {
            tone: createTone({ duration: 12, pitch: "A4" }, 0),
            offset: offset,
            isShunt: false,
            tie: Direction.none
        };
    });
}

it("dotted correctly (D+E)", () => {
    const details = generateToneList([9, 8]);
    const slots = getDotSlots(details);
    expect(slots).toEqual({ "9": true, "7": true });
});

it("dotted correctly (D+F+A+D)", () => {
    const details = generateToneList([9, 7, 5, 1]);
    const slots = getDotSlots(details);
    expect(slots).toEqual({ "1": true, "5": true, "7": true, "9": true });
});

it("dotted correctly (E+G+A)", () => {
    const details = generateToneList([1, -1, -2]);
    const slots = getDotSlots(details);
    expect(slots).toEqual({ "-3": true, "-1": true, "1": true });
});

it("dotted correctly (E+F)", () => {
    const details = generateToneList([8, 7]);
    const slots = getDotSlots(details);
    expect(slots).toEqual({ "9": true, "7": true });
});

it("dotted correctly (D+A+B)", () => {
    const details = generateToneList([2, -2, -3]);
    const slots = getDotSlots(details);
    expect(slots).toEqual({ "-3": true, "-1": true, "1": true });
});

it("dotted correctly (F+G+A)", () => {
    const details = generateToneList([7, 6, 5]);
    const slots = getDotSlots(details);
    expect(slots).toEqual({ "7": true, "5": true, "3": true });
});

it("dotted correctly (E+G+A)", () => {
    const details = generateToneList([8, 6, 5]);
    const slots = getDotSlots(details);
    expect(slots).toEqual({ "9": true, "7": true, "5": true });
});

it("dotted correctly (A+B+C+D+E)", () => {
    const details = generateToneList([5, 4, 3, 2, 1]);
    const slots = getDotSlots(details);
    expect(slots).toEqual({ "7": true, "5": true, "3": true, "1": true, "-1": true });
});

it("dotted correctly (F+G+A+B)", () => {
    const details = generateToneList([7, 6, 5, 4]);
    const slots = getDotSlots(details);
    expect(slots).toEqual({ "9": true, "7": true, "5": true, "3": true });
});

it("dotted correctly (F+G+A+C+D+E+F+G)", () => {
    const details = generateToneList([7, 6, 5, 3, 2, 1, 0, -1]);
    const slots = getDotSlots(details);
    expect(slots).toEqual({ "7": true, "5": true, "3": true, "1": true, "-1": true });
});
