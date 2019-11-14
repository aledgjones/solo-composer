import { FlowKey } from "../services/flow";
import { Score } from "../services/score";
import { EngravingConfig, defaultEngravingConfig } from "../services/engraving";
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
import { measureStavePrologue, drawStavePrologue } from "./draw-stave-prologue";
import { Converter } from "./converter";

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
    const namesWidth = getNamesWidth(names, config, converter);

    const verticalMeasurements = measureVerticalLayout(instruments, config);
    const prologueWidth = measureStavePrologue(0, flowEntries, staves, config);

    const x = config.framePadding.left + namesWidth + config.staveInstrumentNameGap + measureBracketAndBracesWidth(verticalMeasurements);
    const y = config.framePadding.top;

    const width = prologueWidth.reduce((a, b) => a + b, 0) + 50;

    instructions.layers.score = mergeInstructions(
        ...drawNames(config.framePadding.left + namesWidth, y, instruments, names, verticalMeasurements, config),
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