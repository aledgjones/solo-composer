import { FlowKey } from "../services/flow";
import { Score } from "../services/score";
import { EngravingConfig } from "../services/engraving";

import { getInstruments, getCounts } from "../services/instrument";
import { getNames, NameType } from "./get-names";
import { getStaves } from "../services/stave";
import { entriesByTick } from "../services/track";

import { measureVerticalLayout } from "./measure-vertical-layout";
import { measureNames } from "./measure-names";
import { RenderInstructions, mergeInstructions, Instruction } from "./instructions";
import { measureBracketAndBraces } from "./measure-brackets-and-braces";
import { measureStavePrologue, drawStavePrologue } from "./draw-stave-prologue";

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
import { drawRest } from "../entries/rest";
import { drawBarlines } from "./draw-barlines";
import { createBarline, drawBarline, BarlineType } from "../entries/barline";
import { drawNote } from "../entries/note";
import { getNearestEntryToTick } from "./get-nearest-entry-to-tick";
import { TimeSignature } from "../entries/time-signature";
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
    const prologueWidths = measureStavePrologue(0, flowEntriesByTick, staves, config);
    const prologueWidth = prologueWidths.reduce((a, b) => a + b, 0);

    const x = config.framePadding.left + namesWidth + config.staveInstrumentNameGap + measureBracketAndBraces(verticalMeasurements);
    const y = config.framePadding.top;

    const barlines = getFirstBeats(flow.length, flowEntriesByTick);

    // these are helpers to render these entries
    const normalBarline = createBarline({ type: BarlineType.normal }, 0);
    const finalBarline = createBarline({ type: config.finalBarlineType }, 0);

    const notationTracks = getWrittenDurations(flow.length, flowEntriesByTick, staves, barlines);

    // 2) create a rhythmic grid for the whole flow (ie. spacings)
    // 3) assign widths to ticks

    // [tick-prologue, spacing-rule];
    const tickWidths: [number, number][] = [];
    for (let tick = 0; tick < flow.length; tick++) {
        const pre = barlines.includes(tick) ? 1 : 0;
        tickWidths.push([pre, .75]);
    }

    const notationWidth = tickWidths.reduce<number>((sum, tick) => sum + tick[0] + tick[1], 0);

    // 4) any scaling can be applied to the second tick width for fitting into pages etc later on

    // 5) draw items at tick positions

    const drawInstructions: Instruction<any>[] = [];

    let currentX = x + prologueWidth;
    for (let tick = 0; tick < flow.length; tick++) {

        const timeSig = getNearestEntryToTick<TimeSignature>(tick, flowEntriesByTick, EntryType.timeSignature);
        const subdivisions = timeSig.entry ? timeSig.entry.subdivisions : 12;

        const flowEntriesAtTick = flowEntriesByTick[tick] || [];
        const barline = flowEntriesAtTick.filter(entry => entry._type === EntryType.barline)[0];

        if (barline) {
            drawInstructions.push(...drawBarline(currentX, y, staves, verticalMeasurements, barline));
            currentX += barline._bounds.width;
        } else if (tick !== 0 && (timeSig.entry && timeSig.entry.beats > 0) && barlines.includes(tick)) {
            drawInstructions.push(...drawBarline(currentX, y, staves, verticalMeasurements, normalBarline));
            currentX += normalBarline._bounds.width;
        }

        const placementX = tickWidths[tick];
        currentX = currentX + placementX[0];

        staves.forEach(stave => {

            const staveEntriesByTick = entriesByTick(stave.master.entries.order, stave.master.entries.byKey);
            const clef = getNearestEntryToTick<Clef>(tick, staveEntriesByTick, EntryType.clef);
            const clefPitch = clef.entry ? clef.entry.type : 'G4';
            const clefOffset = clef.entry ? clef.entry.offset : 3;

            stave.tracks.order.forEach(trackKey => {

                const notationTrack = notationTracks[trackKey];
                const top = y + verticalMeasurements.staves[stave.key].y;
                const tones = stave.tracks.byKey[trackKey].entries.byKey;

                if (notationTrack[tick]) {
                    const entry = notationTrack[tick];
                    const length = getNotationBaseLength(entry.duration, subdivisions);
                    const isDotted = getIsDotted(entry.duration, subdivisions);
                    if (entry.type === NotationType.rest) {
                        drawInstructions.push(...drawRest(currentX, top, length, isDotted));
                    } else {
                        entry.keys.forEach(key => {
                            const tone = tones[key] as Tone;
                            const toneOffset = getStepsBetweenPitces(clefPitch, tone.pitch);
                            const offset = (clefOffset / 2) - (toneOffset / 2);
                            drawInstructions.push(...drawNote(currentX, top, offset, length, isDotted));
                        });
                    }
                }

            })
        });

        currentX = currentX + placementX[1];

    }

    return {
        height: config.framePadding.top + verticalMeasurements.systemHeight + config.framePadding.bottom,
        width: x + prologueWidth + notationWidth + config.framePadding.right,
        entries: mergeInstructions(
            ...drawNames(config.framePadding.left, y, namesWidth, instruments, names, verticalMeasurements, config),
            ...drawBraces(x, y, verticalMeasurements),
            ...drawBrackets(x, y, verticalMeasurements, config),
            ...drawSubBrackets(x, y, verticalMeasurements),
            ...drawStaves(x, y, prologueWidth + notationWidth + finalBarline._bounds.width, staves, verticalMeasurements),
            ...drawStavePrologue(x, y, prologueWidths, verticalMeasurements, flowEntriesByTick, staves, 0),

            ...drawBarlines(x + prologueWidth, y, barlines, flowEntriesByTick, staves, verticalMeasurements, tickWidths),
            ...drawInstructions,
            ...drawFinalBarline(x + prologueWidth + notationWidth, y, staves, verticalMeasurements, finalBarline)
        )
    };

}