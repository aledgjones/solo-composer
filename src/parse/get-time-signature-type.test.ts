import { createTimeSignature } from "../entries/time-signature";
import { getTimeSignatureType, TimeSignatureType } from "./get-time-signature-type";

// x/4

it('Is the right type', () => {
    const sig = createTimeSignature({ beats: 1, beatType: 4 }, 0);
    const type = getTimeSignatureType(sig);
    expect(type).toEqual(TimeSignatureType.simple);
});

it('Is the right type', () => {
    const sig = createTimeSignature({ beats: 2, beatType: 4 }, 0);
    const type = getTimeSignatureType(sig);
    expect(type).toEqual(TimeSignatureType.simple);
});

it('Is the right type', () => {
    const sig = createTimeSignature({ beats: 3, beatType: 4 }, 0);
    const type = getTimeSignatureType(sig);
    expect(type).toEqual(TimeSignatureType.simple);
});

it('Is the right type', () => {
    const sig = createTimeSignature({ beats: 4, beatType: 4 }, 0);
    const type = getTimeSignatureType(sig);
    expect(type).toEqual(TimeSignatureType.simple);
});

it('Is the right type', () => {
    const sig = createTimeSignature({ beats: 5, beatType: 4 }, 0);
    const type = getTimeSignatureType(sig);
    expect(type).toEqual(TimeSignatureType.complex);
});

it('Is the right type', () => {
    const sig = createTimeSignature({ beats: 6, beatType: 4 }, 0);
    const type = getTimeSignatureType(sig);
    expect(type).toEqual(TimeSignatureType.compound);
});

it('Is the right type', () => {
    const sig = createTimeSignature({ beats: 7, beatType: 4 }, 0);
    const type = getTimeSignatureType(sig);
    expect(type).toEqual(TimeSignatureType.complex);
});

it('Is the right type', () => {
    const sig = createTimeSignature({ beats: 8, beatType: 4 }, 0);
    const type = getTimeSignatureType(sig);
    expect(type).toEqual(TimeSignatureType.simple);
});

it('Is the right type', () => {
    const sig = createTimeSignature({ beats: 9, beatType: 4 }, 0);
    const type = getTimeSignatureType(sig);
    expect(type).toEqual(TimeSignatureType.compound);
});

it('Is the right type', () => {
    const sig = createTimeSignature({ beats: 10, beatType: 4 }, 0);
    const type = getTimeSignatureType(sig);
    expect(type).toEqual(TimeSignatureType.simple);
});

it('Is the right type', () => {
    const sig = createTimeSignature({ beats: 11, beatType: 4 }, 0);
    const type = getTimeSignatureType(sig);
    expect(type).toEqual(TimeSignatureType.complex);
});

it('Is the right type', () => {
    const sig = createTimeSignature({ beats: 12, beatType: 4 }, 0);
    const type = getTimeSignatureType(sig);
    expect(type).toEqual(TimeSignatureType.compound);
});