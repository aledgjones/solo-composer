import { getDefaultGroupings } from "./get-default-groupings";


it('is grouped correctly (0)', () => {
    const groups = getDefaultGroupings(0);
    expect(groups).toEqual([]);
});

it('is grouped correctly (1)', () => {
    const groups = getDefaultGroupings(1);
    expect(groups).toEqual([1]);
});

it('is grouped correctly (2)', () => {
    const groups = getDefaultGroupings(2);
    expect(groups).toEqual([1, 1]);
});

it('is grouped correctly (3)', () => {
    const groups = getDefaultGroupings(3);
    expect(groups).toEqual([1, 1, 1]);
});

it('is grouped correctly (4)', () => {
    const groups = getDefaultGroupings(4);
    expect(groups).toEqual([2, 2]);
});

it('is grouped correctly (5)', () => {
    const groups = getDefaultGroupings(5);
    expect(groups).toEqual([3, 2]);
});

it('is grouped correctly (6)', () => {
    const groups = getDefaultGroupings(6);
    expect(groups).toEqual([3, 3]);
});

it('is grouped correctly (7)', () => {
    const groups = getDefaultGroupings(7);
    expect(groups).toEqual([3, 4]);
});

it('is grouped correctly (8)', () => {
    const groups = getDefaultGroupings(8);
    expect(groups).toEqual([3,3,2]);
});

it('is grouped correctly (9)', () => {
    const groups = getDefaultGroupings(9);
    expect(groups).toEqual([3, 3, 3]);
});

it('is grouped correctly (10)', () => {
    const groups = getDefaultGroupings(10);
    expect(groups).toEqual([3, 3, 4]);
});

it('is grouped correctly (11)', () => {
    const groups = getDefaultGroupings(11);
    expect(groups).toEqual([3, 3, 3, 2]);
});

it('is grouped correctly (12)', () => {
    const groups = getDefaultGroupings(12);
    expect(groups).toEqual([3, 3, 3, 3]);
});