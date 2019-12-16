import { getMIDIPitch } from "./get-midi-pitch";

it('should pass through numbers', () => {
    const pitch = getMIDIPitch(60);
    expect(pitch).toEqual(60);
});

it('is the right pitch (C4)', () => {
    const pitch = getMIDIPitch('C4');
    expect(pitch).toEqual(60);
});

it('is the right pitch (Eb4)', () => {
    const pitch = getMIDIPitch('Eb4');
    expect(pitch).toEqual(63);
});

it('is the right pitch (E#4)', () => {
    const pitch = getMIDIPitch('E#4');
    expect(pitch).toEqual(65);
});