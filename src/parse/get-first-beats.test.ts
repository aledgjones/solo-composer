import { createTimeSignature } from "../entries/time-signature";
import { getDefaultGroupings } from "./get-default-groupings";
import { EntriesByTick } from "../services/track";
import { getFirstBeats } from "./get-first-beats";

it("finds first beats - 2/4", () => {
    const c = 12;
    const len = c * 4;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2) }, 0)]
    };

    const output = getFirstBeats(12, len, flow);

    expect(output).toStrictEqual({ 0: true, [c * 2]: true });
});

it("finds first beats - 3/4", () => {
    const c = 12;
    const len = c * 6;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3) }, 0)]
    };

    const output = getFirstBeats(12, len, flow);

    expect(output).toStrictEqual({ 0: true, [c * 3]: true });
});

it("finds first beats - 4/4", () => {
    const c = 12;
    const len = c * 8;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 4, beatType: 4, groupings: getDefaultGroupings(4) }, 0)]
    };

    const output = getFirstBeats(12, len, flow);

    expect(output).toStrictEqual({ 0: true, [c * 4]: true });
});

it("finds first beats - 2/4 & 3/4", () => {
    const c = 12;
    const len = c * 10;

    const flow: EntriesByTick = {
        [0]: [createTimeSignature({ beats: 2, beatType: 4, groupings: getDefaultGroupings(2) }, 0)],
        [c * 4]: [createTimeSignature({ beats: 3, beatType: 4, groupings: getDefaultGroupings(3) }, 0)]
    };

    const output = getFirstBeats(12, len, flow);

    expect(output).toStrictEqual({ 0: true, [c * 2]: true, [c * 4]: true, [c * 7]: true });
});
