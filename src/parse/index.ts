import { FlowKey } from "../services/flow";
import { Score } from "../services/score";
import { EngravingConfig } from "../services/engraving";

import { getInstruments, getCounts } from "../services/instrument";
import { getNames, NameType } from "./get-names";
import { getStaves } from "../services/stave";
import { entriesByTick, EntriesByTick } from "../services/track";

import { measureVerticalLayout } from "./measure-vertical-layout";
import { measureNames } from "./measure-names";
import { RenderInstructions, mergeInstructions, Instruction } from "./instructions";
import { measureBracketAndBraces } from "./measure-brackets-and-braces";
import { measureTick, drawTick } from "./draw-tick";

import { drawNames } from "./draw-names";
import { drawBraces } from "./draw-braces";
import { drawBrackets } from "./draw-brackets";
import { drawSubBrackets } from "./draw-sub-brackets";
import { drawStaves } from "./draw-staves";
import { drawFinalBarline } from "./draw-final-barline";

import { Converter } from "./converter";

import { NotationType, getNotationBaseLength, getIsDotted } from "./notation-track";
import { getFirstBeats } from "./get-first-beats";
import { getWrittenDurations } from "./get-written-durations";
import { EntryType } from "../entries";
import { drawRest } from "./draw-rest";
import { createBarline, drawBarline, BarlineType } from "../entries/barline";
import { drawNote } from "./draw-note";
import { getNearestEntryToTick } from "./get-nearest-entry-to-tick";
import { TimeSignature, drawTimeSignature } from "../entries/time-signature";
import { Clef } from "../entries/clef-defs";
import { Tone } from "../entries/tone";
import { getStepsBetweenPitces } from "./get-steps-between-pitches";

export function parse(score: Score, flowKey: FlowKey, config: EngravingConfig, converter: Converter): RenderInstructions {

    const flow = score.flows.byKey[flowKey];

    const instruments = getInstruments(score.players, score.instruments, flow);
    const staves = getStaves(instruments, flow);
    const flowEntriesByTick = entriesByTick(flow.master.entries.order, flow.master.entries.byKey);

    const counts = getCounts(score.players, score.instruments, score.config);
    const names = getNames(instruments, counts, NameType.long);
    const namesWidth = measureNames(names, config, converter);

    const verticalMeasurements = measureVerticalLayout(instruments, config);

    const x = config.framePadding.left + namesWidth + config.staveInstrumentNameGap + measureBracketAndBraces(verticalMeasurements);
    const y = config.framePadding.top;

    const barlines = getFirstBeats(flow.length, flowEntriesByTick);
    const finalBarline = createBarline({ type: config.finalBarlineType }, 0);

    const notationTracks = getWrittenDurations(flow.length, flowEntriesByTick, staves, barlines);

    // 2) create a rhythmic grid for the whole flow (ie. spacings)
    // 3) assign widths to ticks

    // [tick-prologue, spacing-rule];
    const tickWidths: number[][] = [];
    for (let tick = 0; tick < flow.length; tick++) {
        const width = measureTick(tick, barlines.includes(tick), flowEntriesByTick, staves, config);
        tickWidths.push(width);
    }

    const notationWidth = tickWidths.reduce<number>((sum, tick) => {
        tick.forEach(width => {
            sum += width;
        });
        return sum;
    }, 0);

    // 4) any scaling can be applied to the second tick width for fitting into pages etc later on

    // 5) draw items at tick positions

    const drawInstructions: Instruction<any>[] = [];

    let currentX = x + config.systemStartPadding;
    for (let tick = 0; tick < flow.length; tick++) {

        drawInstructions.push(...drawTick(tick, barlines.includes(tick), currentX, y, tickWidths[tick], verticalMeasurements, flowEntriesByTick, staves));
        currentX += tickWidths[tick].reduce<number>((sum, width) => sum + width, 0);
    }
    //     const timeSig = getNearestEntryToTick<TimeSignature>(tick, flowEntriesByTick, EntryType.timeSignature);
    //     const subdivisions = timeSig.entry ? timeSig.entry.subdivisions : 12;

    //     const flowEntriesAtTick = flowEntriesByTick[tick] || [];
    //     const barline = flowEntriesAtTick.filter(entry => entry._type === EntryType.barline)[0];

    //     const placementX = tickWidths[tick];
    //     currentX = currentX + placementX[0];

    //     staves.forEach(stave => {

    //         const top = y + verticalMeasurements.staves[stave.key].y;
    //         const staveEntriesByTick = entriesByTick(stave.master.entries.order, stave.master.entries.byKey);
    //         const clef = getNearestEntryToTick<Clef>(tick, staveEntriesByTick, EntryType.clef);
    //         const clefPitch = clef.entry ? clef.entry.type : 'G4';
    //         const clefOffset = clef.entry ? clef.entry.offset : 3;

    //         if (timeSig.entry && timeSig.at === tick) {
    //             drawInstructions.push(...drawTimeSignature(currentX, top, timeSig.entry));
    //         }

    //         stave.tracks.order.forEach(trackKey => {

    //             const notationTrack = notationTracks[trackKey];

    //             const tones = stave.tracks.byKey[trackKey].entries.byKey;

    //             if (notationTrack[tick]) {
    //                 const entry = notationTrack[tick];
    //                 const length = getNotationBaseLength(entry.duration, subdivisions);
    //                 const isDotted = getIsDotted(entry.duration, subdivisions);
    //                 if (entry.type === NotationType.rest) {
    //                     drawInstructions.push(...drawRest(currentX, top, length, isDotted));
    //                 } else {
    //                     entry.keys.forEach(key => {
    //                         const tone = tones[key] as Tone;
    //                         const toneOffset = getStepsBetweenPitces(clefPitch, tone.pitch);
    //                         const offset = (clefOffset / 2) - (toneOffset / 2);
    //                         drawInstructions.push(...drawNote(currentX, top, offset, length, isDotted));
    //                     });
    //                 }
    //             }

    //         })
    //     });

    //     currentX = currentX + placementX[1];


    return {
        height: config.framePadding.top + verticalMeasurements.systemHeight + config.framePadding.bottom,
        width: x + notationWidth + config.framePadding.right,
        entries: mergeInstructions(
            ...drawNames(config.framePadding.left, y, namesWidth, instruments, names, verticalMeasurements, config),
            ...drawBraces(x, y, verticalMeasurements),
            ...drawBrackets(x, y, verticalMeasurements, config),
            ...drawSubBrackets(x, y, verticalMeasurements),
            ...drawStaves(x, y, notationWidth + finalBarline._bounds.width, staves, verticalMeasurements),
            ...drawInstructions,
            ...drawFinalBarline(x + notationWidth, y, staves, verticalMeasurements, finalBarline)
        )
    };

}