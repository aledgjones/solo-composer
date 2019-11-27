import { getTimeSignatureType, TimeSignatureType } from "./get-time-signature-type";

it('is the right type (0)', () => {
    const type = getTimeSignatureType(0);
    expect(type).toEqual(TimeSignatureType.open);
});

it('is the right type (1)', () => {
    const type = getTimeSignatureType(1);
    expect(type).toEqual(TimeSignatureType.simple);
});

it('is the right type (2)', () => {
    const type = getTimeSignatureType(2);
    expect(type).toEqual(TimeSignatureType.simple);
});

it('is the right type (3)', () => {
    const type = getTimeSignatureType(3);
    expect(type).toEqual(TimeSignatureType.simple);
});

it('is the right type (4)', () => {
    const type = getTimeSignatureType(4);
    expect(type).toEqual(TimeSignatureType.simple);
});

it('is the right type (5)', () => {
    const type = getTimeSignatureType(5);
    expect(type).toEqual(TimeSignatureType.complex);
});

it('is the right type (6)', () => {
    const type = getTimeSignatureType(6);
    expect(type).toEqual(TimeSignatureType.compound);
});

it('is the right type (7)', () => {
    const type = getTimeSignatureType(7);
    expect(type).toEqual(TimeSignatureType.complex);
});

it('is the right type (8)', () => {
    const type = getTimeSignatureType(8);
    expect(type).toEqual(TimeSignatureType.complex);
});

it('is the right type (9)', () => {
    const type = getTimeSignatureType(9);
    expect(type).toEqual(TimeSignatureType.compound);
});

it('is the right type (10)', () => {
    const type = getTimeSignatureType(10);
    expect(type).toEqual(TimeSignatureType.complex);
});

it('is the right type (11)', () => {
    const type = getTimeSignatureType(11);
    expect(type).toEqual(TimeSignatureType.complex);
});

it('is the right type (12)', () => {
    const type = getTimeSignatureType(12);
    expect(type).toEqual(TimeSignatureType.compound);
});