import { FlowKey } from "../services/flow";
import { Score } from "../services/score";
import { EngravingConfig } from "../services/engraving";

import { getInstruments, getCounts } from "../services/instrument";
import { getNames, NameType } from "./get-names";
import { getStaves } from "../services/stave";
import { entriesByTick } from "../services/track";

import { measureVerticalLayout } from "./measure-vertical-layout";
import { measureNames } from "./measure-names";
import { RenderInstructions, mergeInstructions } from "./instructions";
import { measureBracketAndBraces } from "./measure-brackets-and-braces";
import { measureStavePrologue, drawStavePrologue } from "./draw-stave-prologue";
import { notateTones } from "./notate-tones";

import { drawNames } from "./draw-names";
import { drawBraces } from "./draw-braces";
import { drawBrackets } from "./draw-brackets";
import { drawSubBrackets } from "./draw-sub-brackets";
import { drawStaves } from "./draw-staves";
import { drawFinalBarline } from "./draw-final-barline";

import { Converter } from "./converter";

import { debugTicks } from "../debug/debug-ticks";
import { debugTrack } from "../debug/debug-track";
import { splitAsPerMeter } from "./split-as-per-meter";

export function parse(score: Score, flowKey: FlowKey, config: EngravingConfig, converter: Converter): RenderInstructions {

    const instructions: RenderInstructions = {
        height: 0.0,
        width: 0.0,
        layers: {
            debug: [],
            score: [],
            selection: []
        }
    };

    const flow = score.flows.byKey[flowKey];

    const instruments = getInstruments(score.players, score.instruments, flow);
    const staves = getStaves(instruments, flow);
    const flowEntries = flow.master.entries.order.map(flowKey => flow.master.entries.byKey[flowKey]);

    const counts = getCounts(score.players, score.instruments, score.config);
    const names = getNames(instruments, counts, NameType.long);
    const namesWidth = measureNames(names, config, converter);

    const verticalMeasurements = measureVerticalLayout(instruments, config);
    const prologueWidth = measureStavePrologue(0, flowEntries, staves, config);

    const x = config.framePadding.left + namesWidth + config.staveInstrumentNameGap + measureBracketAndBraces(verticalMeasurements);
    const y = config.framePadding.top;

    //--- TEMPORARY ---//

    // 1) convert track data into written note durations

    debugTicks(flow);

    const flowEntriesByTick = entriesByTick(flow.master.entries.order, flow.master.entries.byKey);

    staves.forEach(stave => {
        stave.tracks.order.forEach(trackKey => {
            const track = stave.tracks.byKey[trackKey];
            const trackEventsByTick = entriesByTick(track.entries.order, track.entries.byKey);
            let rhythmTrack = {};
            rhythmTrack = notateTones(flow.length, flow.subdivisions, trackEventsByTick, flowEntriesByTick, rhythmTrack);
            rhythmTrack = splitAsPerMeter(flow.subdivisions, flowEntriesByTick, rhythmTrack);
            debugTrack(flow, rhythmTrack);
        });
    });

    // 2) create a rhythmic grid for the whole flow (ie. spacings)
    // 3) assign widths to ticks
    // 4) draw items at tick positions
    // 5) add up all tick spacings to get stave width

    const width = prologueWidth.reduce((a, b) => a + b, 0) + 50;

    instructions.layers.score = mergeInstructions(
        ...drawNames(config.framePadding.left, y, namesWidth, instruments, names, verticalMeasurements, config),
        ...drawBraces(x, y, verticalMeasurements),
        ...drawBrackets(x, y, verticalMeasurements, config),
        ...drawSubBrackets(x, y, verticalMeasurements),
        ...drawStaves(x, y, width, staves, verticalMeasurements),
        ...drawStavePrologue(x, y, prologueWidth, verticalMeasurements, flowEntries, staves, 0),

        ...drawFinalBarline(x + width, y, staves, verticalMeasurements, config)
    );

    instructions.height = config.framePadding.top + verticalMeasurements.systemHeight + config.framePadding.bottom;
    instructions.width = x + width + config.framePadding.right;

    return instructions;

}