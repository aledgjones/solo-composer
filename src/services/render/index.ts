import { useCallback } from "react";
import { Score } from "../score";
import { FlowKey } from "../flow";
import { useCounts, useInstruments } from "../instrument";
import { useStaves } from "../stave";

import { useCanvas } from "./use-canvas";
import { useRenderLoop } from "./use-render-loop";
import { clearCanvas } from "./clear-canvas";
import { defaultEngravingConfig } from "../engraving";
import { useConverter } from "./use-converter";
import { useConvertedConfig } from "./use-converted-config";

import { useNames } from "./use-names";
import { useMeasureSystem } from "./use-measure-system";
import { measureBracketAndBraces } from "./measure-brackets-and-braces";

import { drawNames } from "./draw-names";
import { drawBraces } from "./draw-braces";
import { drawBrackets } from "./draw-brackets";
import { drawSubBrackets } from "./draw-sub-brackets";
import { drawStaves } from "./draw-staves";
import { drawStavePrologue } from "./draw-stave-prologue";
import { drawBarline, createBarline, BarlineType } from "../entries/barline";

export function useRenderWriteMode(score: Score, flowKey: FlowKey) {

    const { canvas, ctx } = useCanvas();

    const converter = useConverter(score.engraving.score.space || defaultEngravingConfig.space);
    const config = useConvertedConfig({ ...defaultEngravingConfig, ...score.engraving.score }, converter);

    const flow = score.flows.byKey[flowKey];
    const instruments = useInstruments(score, flow);
    const staves = useStaves(instruments, flow);
    const counts = useCounts(score);
    const { names, max: nameWidth } = useNames(instruments, counts, config, ctx);
    const metrics = useMeasureSystem(instruments, config);

    const render = useCallback(() => {

        if (!ctx) return undefined;

        const x = config.framePadding.left + nameWidth + config.staveInstrumentNameGap + measureBracketAndBraces(metrics, converter);
        const y = config.framePadding.top;
        const width = converter.spaces.toPX(50);

        ctx.canvas.width = x + width + config.framePadding.right;
        ctx.canvas.height = config.framePadding.top + metrics.systemHeight + config.framePadding.bottom;
        clearCanvas(ctx);

        drawStaves(ctx, x, y, width, staves, metrics, config, converter);
        
        drawNames(ctx, config.framePadding.left + nameWidth, instruments, names, metrics, config);
        drawBraces(ctx, metrics, config, x);
        drawBrackets(ctx, x, y, metrics, config, converter);
        drawSubBrackets(ctx, x, y, metrics, config, converter);

        const flowEntries = flow.master.entries.order.map(flowKey => flow.master.entries.byKey[flowKey])

        staves.forEach(stave => {
            const staveEntries = stave.master.entries.order.map(staveKey => stave.master.entries.byKey[staveKey]);
            const top = y + metrics.staves[stave.key].y;

            drawStavePrologue(ctx, x, top, config, flowEntries, staveEntries, converter);
        });

        const barline = createBarline({ type: BarlineType.final }, 0);
        drawBarline(ctx, x + width - converter.spaces.toPX(.75), y, metrics, barline, converter);

    }, [config, instruments, staves, metrics, names, nameWidth, ctx, flow.master.entries.order, flow.master.entries.byKey, converter]);

    useRenderLoop(render);

    return canvas;
}
