import { FlowKey } from "../services/flow";
import { Score } from "../services/score";
import { Converter } from "./converter";
import { defaultEngravingConfig } from "../services/engraving";
import { getConvertedConfig } from "./get-converted-config";
import { getInstruments, getCounts } from "../services/instrument";
import { getStaves } from "../services/stave";
import { measureVerticalLayout } from "./measure-vertical-layout";
import { getNames, getNamesWidth, NameType } from "./get-names";
import { RenderInstructions, mergeInstructions } from "./instructions";
import { measureBracketAndBracesWidth } from "./measure-brackets-and-braces-width";
import { drawNames } from "./draw-names";
import { drawBraces } from "./draw-braces";
import { drawBrackets } from "./draw-brackets";
import { drawSubBrackets } from "./draw-sub-brackets";
import { drawStaves } from "./draw-staves";
import { drawFinalBarline } from "./draw-final-barline";

export function parse(score: Score, flowKey: FlowKey, Converter: (space: number) => Converter): RenderInstructions {

    const instructions: RenderInstructions = {
        height: 0.0,
        width: 0.0,
        layers: {
            debug: [],
            score: [],
            selection: []
        }
    };

    const converter = Converter(score.engraving.score.space || defaultEngravingConfig.space);
    const config = getConvertedConfig({ ...defaultEngravingConfig, ...score.engraving.score }, converter);

    const flow = score.flows.byKey[flowKey];

    const instruments = getInstruments(score.players, score.instruments, flow);
    const staves = getStaves(instruments, flow);
    const flowEntries = flow.master.entries.order.map(flowKey => flow.master.entries.byKey[flowKey]);

    const counts = getCounts(score.players, score.instruments, score.config);
    const names = getNames(instruments, counts, NameType.long);
    const namesWidth = getNamesWidth(names, config);

    const verticalMeasurements = measureVerticalLayout(instruments, config, converter);

    const x = config.framePadding.left + namesWidth + config.staveInstrumentNameGap + measureBracketAndBracesWidth(verticalMeasurements, converter);
    const y = config.framePadding.top;
    const width = converter.spaces.toPX(50);

    //--- TEMPORARY ---//

    // 1) convert track data into written note durations
    // 2) create a rhythmic grid for the whole flow (ie. spacings)
    // 3) assign widths to ticks
    // 4) draw items at tick positions
    // 5) add up all tick spacings to get stave width

    // staves.forEach(stave => {
    //     const staveEntries = stave.master.entries.order.map(staveKey => stave.master.entries.byKey[staveKey]);
    //     const top = y + verticalLayout.staves[stave.key].y;

    //     const width = drawStavePrologue(renderer, x, top, config, flowEntries, staveEntries, converter);
    //     prologueWidth = width > prologueWidth ? width : prologueWidth;
    // });

    instructions.layers.score = mergeInstructions(
        ...drawNames(config.framePadding.left + namesWidth, y, instruments, names, verticalMeasurements, config),
        ...drawBraces(x, y, verticalMeasurements, converter),
        ...drawBrackets(x, y, verticalMeasurements, config, converter),
        ...drawSubBrackets(x, y, verticalMeasurements, converter),
        ...drawStaves(x, y, width, staves, verticalMeasurements, converter),
        ...drawFinalBarline(x + width, y, staves, verticalMeasurements, config, converter)
    );

    instructions.height = config.framePadding.top + verticalMeasurements.systemHeight + config.framePadding.bottom;
    instructions.width = x + width + config.framePadding.right;

    return instructions;

}