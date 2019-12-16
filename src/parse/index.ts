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

export function parse(score: Score, flowKey: FlowKey, config: EngravingConfig, converter: Converter): RenderInstructions {

    const flow = score.flows.byKey[flowKey];

    const instruments = getInstruments(score.players, score.instruments, flow);
    const staves = getStaves(instruments, flow);
    const flowEntries = entriesByTick(flow.master.entries.order, flow.master.entries.byKey);

    const counts = getCounts(score.players, score.instruments, score.config);
    const names = getNames(instruments, counts, NameType.long);
    const namesWidth = measureNames(names, config, converter);

    const verticalMeasurements = measureVerticalLayout(instruments, config);
    const prologueWidths = measureStavePrologue(0, flowEntries, staves, config);
    const prologueWidth = prologueWidths.reduce((a, b) => a + b, 0);

    const x = config.framePadding.left + namesWidth + config.staveInstrumentNameGap + measureBracketAndBraces(verticalMeasurements);
    const y = config.framePadding.top;

    const barlines = getFirstBeats(flow.length, flowEntries);
    const normalBarline = createBarline({ type: BarlineType.normal }, 0);
    const finalBarline = createBarline({ type: config.finalBarlineType }, 0);

    const notationTracks = getWrittenDurations(flow.length, flowEntries, staves, barlines);

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

        if (tick !== 0 && barlines.includes(tick)) {
            drawInstructions.push(...drawBarline(currentX, y, staves, verticalMeasurements, normalBarline));
        }

        const placementX = tickWidths[tick];
        currentX = currentX + placementX[0];

        const timeSig = getNearestEntryToTick<TimeSignature>(tick, flowEntries, EntryType.timeSignature);
        const subdivisions = timeSig.entry ? timeSig.entry.subdivisions : 12;

        staves.forEach(stave => {
            stave.tracks.order.forEach(trackKey => {

                const track = notationTracks[trackKey];
                const top = y + verticalMeasurements.staves[stave.key].y;

                if (track[tick]) {
                    const entry = track[tick];
                    const length = getNotationBaseLength(entry.duration, subdivisions);
                    const isDotted = getIsDotted(entry.duration, subdivisions);
                    if (entry.type === NotationType.rest) {
                        drawInstructions.push(...drawRest(currentX, top, length, isDotted));
                    } else {
                        drawInstructions.push(...drawNote(currentX, top, length, isDotted));
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
            ...drawStavePrologue(x, y, prologueWidths, verticalMeasurements, flowEntries, staves, 0),

            ...drawBarlines(x + prologueWidth, y, barlines, flowEntries, staves, verticalMeasurements, tickWidths),
            ...drawInstructions,
            ...drawFinalBarline(x + prologueWidth + notationWidth, y, staves, verticalMeasurements, finalBarline)
        )
    };

}