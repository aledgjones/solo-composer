import { createTimeSignature } from "../entries/time-signature";
import { getGroupings } from "./get-groupings";

// x/4

it('Is the grouping (1)', () => {
    const sig = createTimeSignature({ beats: 1, beatType: 4 }, 0);
    const groups = getGroupings(sig);
    expect(groups).toEqual([1]);
});

it('Is the grouping (2)', () => {
    const sig = createTimeSignature({ beats: 2, beatType: 4 }, 0);
    const groups = getGroupings(sig);
    expect(groups).toEqual([1, 1]);
});

it('Is the grouping (3)', () => {
    const sig = createTimeSignature({ beats: 3, beatType: 4 }, 0);
    const groups = getGroupings(sig);
    expect(groups).toEqual([1, 1, 1]);
});

it('Is the grouping (4)', () => {
    const sig = createTimeSignature({ beats: 4, beatType: 4 }, 0);
    const groups = getGroupings(sig);
    expect(groups).toEqual([2, 2]);
});

it('Is the grouping (5)', () => {
    const sig = createTimeSignature({ beats: 5, beatType: 4 }, 0);
    const groups = getGroupings(sig);
    expect(groups).toEqual([3, 2]);
});

it('Is the grouping (6)', () => {
    const sig = createTimeSignature({ beats: 6, beatType: 4 }, 0);
    const groups = getGroupings(sig);
    expect(groups).toEqual([3, 3]);
});

it('Is the grouping (7)', () => {
    const sig = createTimeSignature({ beats: 7, beatType: 4 }, 0);
    const groups = getGroupings(sig);
    expect(groups).toEqual([3, 2, 2]);
});

it('Is the grouping (8)', () => {
    const sig = createTimeSignature({ beats: 8, beatType: 4 }, 0);
    const groups = getGroupings(sig);
    expect(groups).toEqual([2, 2, 2, 2]);
});

it('Is the grouping', () => {
    const sig = createTimeSignature({ beats: 9, beatType: 4 }, 0);
    const groups = getGroupings(sig);
    expect(groups).toEqual([3, 3, 3]);
});

it('Is the grouping', () => {
    const sig = createTimeSignature({ beats: 10, beatType: 4 }, 0);
    const groups = getGroupings(sig);
    expect(groups).toEqual([2, 2, 2, 2, 2]);
});

it('Is the grouping', () => {
    const sig = createTimeSignature({ beats: 11, beatType: 4 }, 0);
    const groups = getGroupings(sig);
    expect(groups).toEqual([3, 3, 3, 2]);
});

it('Is the grouping', () => {
    const sig = createTimeSignature({ beats: 12, beatType: 4 }, 0);
    const groups = getGroupings(sig);
    expect(groups).toEqual([3, 3, 3, 3]);
});