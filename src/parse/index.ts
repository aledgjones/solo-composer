import { FlowKey } from "../services/flow";
import { Score } from "../services/score";
import { LayoutType, defaultEngravingConfig } from "../services/engraving";

import { getNames, NameType } from "./get-names";
import { getStaves } from "../services/stave";
import { entriesByTick } from "../services/track";

import { measureVerticalLayout } from "./measure-vertical-layout";
import { measureNames } from "./measure-names";
import { RenderInstructions, Instruction } from "../render/instructions";
import { measureBracketAndBraces } from "./measure-brackets-and-braces";
import { measureTick } from "./measure-tick";

import { drawTick } from "./draw-tick";
import { drawNames } from "./draw-names";
import { drawBraces } from "./draw-braces";
import { drawBrackets } from "./draw-brackets";
import { drawSubBrackets } from "./draw-sub-brackets";
import { drawStaves } from "./draw-staves";
import { drawFinalBarline } from "./draw-final-barline";

import { getConverter } from "./converter";

import { getFirstBeats } from "./get-first-beats";
import { getWrittenDurations } from "./get-written-durations";
import { createBarline } from "../entries/barline";
import { getConvertedConfig } from "./get-converted-config";
import { getInstruments, getCounts } from "../services/instrument-utils";
import { buildCurve } from "../render/curve";

export function parse(score: Score, flowKey: FlowKey, mm: number): RenderInstructions {

    const flow = score.flows.byKey[flowKey];

    const converter = getConverter(mm, score.engraving[LayoutType.score].space || defaultEngravingConfig.space, 2);
    const config = getConvertedConfig({ ...defaultEngravingConfig, ...score.engraving[LayoutType.score] }, converter);

    const instruments = getInstruments(score.players, score.instruments, flow);
    const staves = getStaves(instruments, flow);
    const flowEntriesByTick = entriesByTick(flow.master.entries.order, flow.master.entries.byKey);

    const counts = getCounts(score.players, score.instruments, score.config);
    const names = getNames(instruments, counts, NameType.long);
    const namesWidth = measureNames(names, config, converter);

    const verticalMeasurements = measureVerticalLayout(instruments, config);

    const x = config.framePadding.left + namesWidth + config.instrumentName.gap + measureBracketAndBraces(verticalMeasurements);
    const y = config.framePadding.top;

    const firstBeats = getFirstBeats(flow.length, flowEntriesByTick);
    const finalBarline = createBarline({ type: config.finalBarlineType }, 0);

    const notationTracks = getWrittenDurations(flow.length, flowEntriesByTick, staves, flow.tracks, firstBeats);

    const drawInstructions: Instruction<any>[] = [];

    const horizontalMeasurements: number[][] = [];
    for (let tick = 0; tick < flow.length; tick++) {
        horizontalMeasurements.push(measureTick(tick, firstBeats[tick], flowEntriesByTick, staves, notationTracks, config));
    }

    for (let tick = 0; tick < flow.length; tick++) {
        drawInstructions.push(...drawTick(tick, firstBeats[tick], x + config.systemStartPadding, y, horizontalMeasurements, verticalMeasurements, flowEntriesByTick, staves, notationTracks, config));
    }

    const totalWidth = horizontalMeasurements.reduce((out, tickWidths) => {
        out = out + tickWidths.reduce((out, width) => {
            out = out + width;
            return out;
        }, 0);
        return out;
    }, 0);

    drawInstructions.push(
        ...drawNames(config.framePadding.left, y, namesWidth, instruments, names, verticalMeasurements, config),
        ...drawBraces(x, y, verticalMeasurements),
        ...drawBrackets(x, y, verticalMeasurements, config),
        ...drawSubBrackets(x, y, verticalMeasurements),
        ...drawStaves(x, y, totalWidth + finalBarline._bounds.width, staves, verticalMeasurements),
        ...drawFinalBarline(x + totalWidth, y, staves, verticalMeasurements, finalBarline)
    );

    return {
        space: converter.spaces.toPX(1),
        height: config.framePadding.top + verticalMeasurements.systemHeight + config.framePadding.bottom,
        width: x + totalWidth + config.framePadding.right,
        entries: drawInstructions
    };

}