import { toMidiPitchNumber, toMidiPitchString, getStepsBetweenPitches } from "./utils";

it('passes through numbers', () => {
    const pitch = toMidiPitchNumber(60);
    expect(pitch).toEqual(60);
});

it('is the right pitch (C4)', () => {
    const pitch = toMidiPitchNumber("C4");
    expect(pitch).toEqual(60);
});

it('is the right pitch (D4)', () => {
    const pitch = toMidiPitchNumber("D4");
    expect(pitch).toEqual(62);
});

it('is the right pitch (Db4)', () => {
    const pitch = toMidiPitchNumber("Db4");
    expect(pitch).toEqual(61);
});

it('is the right pitch (D#4)', () => {
    const pitch = toMidiPitchNumber("D#4");
    expect(pitch).toEqual(63);
});

it('is the right pitch (Cb4)', () => {
    const pitch = toMidiPitchNumber("Cb4");
    expect(pitch).toEqual(59);
});

it('is the right pitch (C0)', () => {
    const pitch = toMidiPitchNumber("C0");
    expect(pitch).toEqual(12);
});

it('is the right pitch (C4)', () => {
    const pitch = toMidiPitchString("C4");
    expect(pitch).toEqual("C4");
});

it('is the right pitch (60)', () => {
    const pitch = toMidiPitchString(60);
    expect(pitch).toEqual("C4");
});

it('is the right pitch (61)', () => {
    const pitch = toMidiPitchString(61);
    expect(pitch).toEqual("Db4");
});

it('is the right pitch (62)', () => {
    const pitch = toMidiPitchString(62);
    expect(pitch).toEqual("D4");
});

it('is the right interval (60, 62)', () => {
    const interval = getStepsBetweenPitches(60, 62);
    expect(interval).toEqual(1);
});

it('is the right interval (60, 65)', () => {
    const interval = getStepsBetweenPitches(60, 65);
    expect(interval).toEqual(3);
});

it('is the right interval (C4, F4)', () => {
    const interval = getStepsBetweenPitches('C4', 'F4');
    expect(interval).toEqual(3);
});

it('is the right interval (C4, Eb4)', () => {
    const interval = getStepsBetweenPitches('C4', 'Eb4');
    expect(interval).toEqual(2);
});