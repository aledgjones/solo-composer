import { FlowKey } from "../services/flow";
import { Score } from "../services/score";
import { Converter } from "./converter";
import { defaultEngravingConfig } from "../services/engraving";
import { getConvertedConfig } from "./get-converted-config";
import { getInstruments, getCounts } from "../services/instrument";
import { getStaves } from "../services/stave";
import { measureVerticalLayout } from "./measure-vertical-layout";
import { getNames, getNamesWidth, NameType } from "./get-names";
import { RenderInstructions } from "../render/instructions";
import { measureBracketAndBracesWidth } from "./measure-brackets-and-braces-width";
import { drawNames } from "./draw-names";
import { drawBraces } from "./draw-braces";
import { drawBrackets } from "./draw-brackets";
import { drawSubBrackets } from "./draw-sub-brackets";
import { drawStaves } from "./draw-staves";

export function parse(score: Score, flowKey: FlowKey, Converter: (space: number) => Converter): RenderInstructions {

    const instructions: RenderInstructions = {
        height: 0,
        width: 0,
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

    const verticalMeasurements = measureVerticalLayout(instruments, config);

    const x = config.framePadding.left + namesWidth + config.staveInstrumentNameGap + measureBracketAndBracesWidth(verticalMeasurements, converter);
    const y = config.framePadding.top;
    const width = converter.spaces.toPX(50);

    instructions.height = config.framePadding.top + verticalMeasurements.systemHeight + config.framePadding.bottom;
    instructions.width = x + width + config.framePadding.right;

    instructions.layers.score.push(
        ...drawNames(config.framePadding.left + namesWidth, y, instruments, names, verticalMeasurements, config),
        ...drawBraces(x, y, verticalMeasurements, config, converter),
        ...drawBrackets(x, y, verticalMeasurements, config, converter),
        ...drawSubBrackets(x, y, verticalMeasurements, config, converter),
        ...drawStaves(x, y, width, staves, verticalMeasurements, config, converter)
    )

    //--- MOVE THESE ALL INTO PARSER ---//

    // let prologueWidth = 0;
    // staves.forEach(stave => {
    //     const staveEntries = stave.master.entries.order.map(staveKey => stave.master.entries.byKey[staveKey]);
    //     const top = y + verticalLayout.staves[stave.key].y;

    //     const width = drawStavePrologue(renderer, x, top, config, flowEntries, staveEntries, converter);
    //     prologueWidth = width > prologueWidth ? width : prologueWidth;
    // });

    // const finalBarline = createBarline({ type: BarlineType.final }, 0);
    // drawBarline(renderer, x + width - converter.spaces.toPX(finalBarline._bounds.width), config.framePadding.top, verticalLayout, finalBarline, converter);

    return instructions;

}