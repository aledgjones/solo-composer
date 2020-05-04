import { isSpan, BracketSpan } from "./is-span";
import { instrumentDefs } from "../services/instrument-defs";
import { createInstrument } from "../services/instrument";
import { BracketingType } from "./draw-brackets";

const flute1 = createInstrument(instrumentDefs["woodwinds.flute"], []);
const flute2 = createInstrument(instrumentDefs["woodwinds.flute"], []);
const violin = createInstrument(instrumentDefs["strings.violin"], []);
const piano = createInstrument(instrumentDefs["keyboards.piano"], []);

it("single instrument & !config.bracketSingleStaves", () => {
    const span = isSpan(violin, undefined, undefined, BracketingType.orchestral, false);
    expect(span).toEqual(BracketSpan.none);
});

it("single instrument after different type & !config.bracketSingleStaves", () => {
    const span = isSpan(violin, flute1, undefined, BracketingType.orchestral, false);
    expect(span).toEqual(BracketSpan.none);
});

it("single instrument between different types & !config.bracketSingleStaves", () => {
    const span = isSpan(violin, flute1, flute2, BracketingType.orchestral, false);
    expect(span).toEqual(BracketSpan.none);
});

it("single instrument after keyboard & !config.bracketSingleStaves", () => {
    const span = isSpan(violin, piano, undefined, BracketingType.orchestral, false);
    expect(span).toEqual(BracketSpan.none);
});

it("single instrument after keyboard before other & !config.bracketSingleStaves", () => {
    const span = isSpan(violin, piano, flute1, BracketingType.orchestral, false);
    expect(span).toEqual(BracketSpan.none);
});

// BracketSingleStave = true

it("single instrument & config.bracketSingleStaves", () => {
    const span = isSpan(violin, undefined, undefined, BracketingType.orchestral, true);
    expect(span).toEqual(BracketSpan.start);
});

it("single instrument & config.bracketSingleStaves", () => {
    const span = isSpan(violin, flute1, undefined, BracketingType.orchestral, true);
    expect(span).toEqual(BracketSpan.start);
});

it("single instrument between different types & config.bracketSingleStaves", () => {
    const span = isSpan(violin, flute1, flute2, BracketingType.orchestral, true);
    expect(span).toEqual(BracketSpan.start);
});

it("single instrument after keyboard & config.bracketSingleStaves", () => {
    const span = isSpan(violin, piano, undefined, BracketingType.orchestral, true);
    expect(span).toEqual(BracketSpan.start);
});

it("single instrument after keyboard before other & config.bracketSingleStaves", () => {
    const span = isSpan(violin, piano, flute1, BracketingType.orchestral, true);
    expect(span).toEqual(BracketSpan.start);
});

it("same as previous", () => {
    const span = isSpan(violin, violin, undefined, BracketingType.orchestral, false);
    expect(span).toEqual(BracketSpan.continue);
});

it("different to previous", () => {
    const span = isSpan(violin, flute1, violin, BracketingType.orchestral, false);
    expect(span).toEqual(BracketSpan.start);
});

it("same after keyboard", () => {
    const span = isSpan(violin, piano, violin, BracketingType.orchestral, false);
    expect(span).toEqual(BracketSpan.start);
});

it("keyboard after keyboard", () => {
    const span = isSpan(piano, piano, violin, BracketingType.orchestral, false);
    expect(span).toEqual(BracketSpan.none);
});
