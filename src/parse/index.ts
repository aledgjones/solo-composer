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
import { measureTick } from "./measure-tick";

import { drawTick } from "./draw-tick";
import { drawNames } from "./draw-names";
import { drawBraces } from "./draw-braces";
import { drawBrackets } from "./draw-brackets";
import { drawSubBrackets } from "./draw-sub-brackets";
import { drawStaves } from "./draw-staves";
import { drawFinalBarline } from "./draw-final-barline";

import { Converter } from "./converter";

import { getFirstBeats } from "./get-first-beats";
import { getWrittenDurations } from "./get-written-durations";
import { createBarline } from "../entries/barline";

export function parse(score: Score, flowKey: FlowKey, config: EngravingConfig, converter: Converter): RenderInstructions {

    const flow = score.flows.byKey[flowKey];

    const instruments = getInstruments(score.players, score.instruments, flow);
    const staves = getStaves(instruments, flow);
    const flowEntriesByTick = entriesByTick(flow.master.entries.order, flow.master.entries.byKey);

    const counts = getCounts(score.players, score.instruments, score.config);
    const names = getNames(instruments, counts, NameType.long);
    const namesWidth = measureNames(names, config, converter);

    const verticalMeasurements = measureVerticalLayout(instruments, config);

    const x = config.framePadding.left + namesWidth + config.instrumentName.gap + measureBracketAndBraces(verticalMeasurements);
    const y = config.framePadding.top;

    const barlines = getFirstBeats(flow.length, flowEntriesByTick);
    const finalBarline = createBarline({ type: config.finalBarlineType }, 0);

    const notationTracks = getWrittenDurations(flow.length, flowEntriesByTick, staves, barlines);

    // 2) create a rhythmic grid for the whole flow (ie. spacings)
    // 3) assign widths to ticks

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
        drawInstructions.push(...drawTick(tick, barlines.includes(tick), currentX, y, tickWidths[tick], verticalMeasurements, flowEntriesByTick, staves, notationTracks, config, converter));
        currentX += tickWidths[tick].reduce<number>((sum, width) => sum + width, 0);
    }

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