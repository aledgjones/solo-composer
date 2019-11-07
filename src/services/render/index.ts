import { useEffect } from "react";
import { Score } from "../score";
import { FlowKey } from "../flow";
import { useCounts, useInstruments } from "../instrument";
import { useStaves } from "../stave";

import { defaultEngravingConfig } from "../engraving";
import { useConverter } from "./use-converter";
import { useConvertedConfig } from "./use-converted-config";

import { useNames, NameType } from "./use-names";
import { useMeasureSystem } from "./use-measure-system";
import { measureBracketAndBraces } from "./measure-brackets-and-braces";

import { drawNames } from "./draw-names";
import { drawBraces } from "./draw-braces";
import { drawBrackets } from "./draw-brackets";
import { drawSubBrackets } from "./draw-sub-brackets";
import { drawStaves } from "./draw-staves";
import { useRenderer } from "./renderer";

export function useRenderWriteMode(score: Score, flowKey: FlowKey) {

    const renderer = useRenderer();

    const converter = useConverter(score.engraving.score.space || defaultEngravingConfig.space);
    const config = useConvertedConfig({ ...defaultEngravingConfig, ...score.engraving.score }, converter);

    const flow = score.flows.byKey[flowKey];
    const counts = useCounts(score.players, score.instruments, score.config);
    const instruments = useInstruments(score, flow);
    const staves = useStaves(instruments, flow);
    const { names, max: nameWidth } = useNames(renderer, instruments, counts, config, NameType.long);

    const verticalLayout = useMeasureSystem(instruments, config);

    //-- good to here START --// 

    const flowEntries = flow.master.entries.order.map(flowKey => flow.master.entries.byKey[flowKey]);

    const x = config.framePadding.left + nameWidth + config.staveInstrumentNameGap + measureBracketAndBraces(verticalLayout, converter);
    const y = config.framePadding.top;
    const width = converter.spaces.toPX(50);

    useEffect(() => {

        if (!renderer) return undefined;

        renderer.width(x + width + config.framePadding.right);
        renderer.height(config.framePadding.top + verticalLayout.systemHeight + config.framePadding.bottom);
        renderer.clear('#ffffff');

        drawNames(renderer, config.framePadding.left + nameWidth, y, instruments, names, verticalLayout, config);
        drawBraces(renderer, x, y, verticalLayout, config, converter);
        drawBrackets(renderer, x, y, verticalLayout, config, converter);
        drawSubBrackets(renderer, x, y, verticalLayout, config, converter);
        drawStaves(renderer, x, y, width, staves, verticalLayout, config, converter);

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

    }, [config, instruments, staves, verticalLayout, names, nameWidth, renderer, flow.master.entries.order, flow.master.entries.byKey, converter]);

    return renderer.frame();
}
