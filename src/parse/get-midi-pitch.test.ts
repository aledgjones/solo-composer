import { getMIDIPitch } from "./get-midi-pitch";

it('is the right pitch (C4)', () => {
    const pitch = getMIDIPitch('C4');
    expect(pitch).toEqual(72);
});

it('is the right pitch (Eb4)', () => {
    const pitch = getMIDIPitch('Eb4');
    expect(pitch).toEqual(75);
});

it('is the right pitch (E#4)', () => {
    const pitch = getMIDIPitch('E#4');
    expect(pitch).toEqual(77);
});