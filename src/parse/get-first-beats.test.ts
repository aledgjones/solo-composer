import { createTimeSignature } from "../entries/time-signature";
import { getDefaultGroupings } from "./get-default-groupings";
import { EntriesByTick } from "../services/track";
import { getFirstBeats } from "./get-first-beats";

it("finds first beats - 2/4", () => {
    const c = 12;
    const len = c * 4;

    const flow: EntriesByTick = {
        [0]: [
            createTimeSignature(
                { beats: 2, beatType: 4, groupings: getDefaultGroupings(2), subdivisions: 12 },
                0
            )
        ]
    };

    const output = getFirstBeats(len, flow);

    expect(output).toStrictEqual([0, c * 2]);
});

it("finds first beats - 3/4", () => {
    const c = 12;
    const len = c * 6;

    const flow: EntriesByTick = {
        [0]: [
            createTimeSignature(
                { beats: 3, beatType: 4, groupings: getDefaultGroupings(3), subdivisions: 12 },
                0
            )
        ]
    };

    const output = getFirstBeats(len, flow);

    expect(output).toStrictEqual([0, c * 3]);
});

it("finds first beats - 4/4", () => {
    const c = 12;
    const len = c * 8;

    const flow: EntriesByTick = {
        [0]: [
            createTimeSignature(
                { beats: 4, beatType: 4, groupings: getDefaultGroupings(4), subdivisions: 12 },
                0
            )
        ]
    };

    const output = getFirstBeats(len, flow);

    expect(output).toStrictEqual([0, c * 4]);
});

it("finds first beats - 2/4 & 3/4", () => {
    const c = 12;
    const len = c * 10;

    const flow: EntriesByTick = {
        [0]: [
            createTimeSignature(
                { beats: 2, beatType: 4, groupings: getDefaultGroupings(2), subdivisions: 12 },
                0
            )
        ],
        [c * 4]: [
            createTimeSignature(
                { beats: 3, beatType: 4, groupings: getDefaultGroupings(3), subdivisions: 12 },
                0
            )
        ]
    };

    const output = getFirstBeats(len, flow);

    expect(output).toStrictEqual([0, c * 2, c * 4, c * 7]);
});
