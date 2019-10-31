import { useCallback } from "react";
import { Score } from "../score";
import { FlowKey } from "../flow";
import { useCounts, useInstruments } from "../instrument";
import { clearCanvas } from "./clear-canvas";
import { useSystemMetrics } from "./use-system-metrics";
import { drawStaves } from "./draw-staves";
import { useCanvas } from "./use-canvas";
import { useStaves } from "../stave";
import { drawNames } from "./draw-names";
import { useConvertedConfig } from "./useConvertedConfig";
import { renderStavePrologue } from "./render-stave-prologue";
import { useNames } from "./use-names";
import { useRenderLoop } from "./use-render-loop";
import { drawBraces } from "./draw-braces";
import { drawBrackets } from "./draw-brackets";
import { calcBracketAndBracesWidth } from "./calc-bracket-and-braces-width";
import { drawSubBrackets } from "./draw-sub-brackets";
import { defaultEngravingConfig } from "../engraving";

export function useRenderWriteMode(score: Score, flowKey: FlowKey) {

    const { canvas, ctx } = useCanvas();

    const config = useConvertedConfig({ ...defaultEngravingConfig, ...score.engraving.score });

    const flow = score.flows.byKey[flowKey];
    const instruments = useInstruments(score, flow);
    const staves = useStaves(instruments, flow);
    const counts = useCounts(score);
    const { names, max: nameWidth } = useNames(instruments, counts, config, ctx);
    const metrics = useSystemMetrics(instruments, config);

    const render = useCallback(() => {
        if (!ctx) return undefined;

        ctx.canvas.height = config.framePadding.top + metrics.systemHeight + config.framePadding.bottom;
        clearCanvas(ctx);

        let x = config.framePadding.left;
        drawNames(ctx, instruments, names, metrics, config, x, nameWidth);
        x = x + nameWidth + config.staveInstrumentNameGap + calcBracketAndBracesWidth(metrics, config.space);

        drawBraces(ctx, metrics, config, x);
        drawBrackets(ctx, metrics, config, x);
        drawSubBrackets(ctx, metrics, config, x);

        drawStaves(ctx, staves, metrics, config, x);

        ctx.beginPath();
        ctx.moveTo(x, config.framePadding.top);
        ctx.lineTo(x, config.framePadding.top + metrics.systemHeight);
        ctx.stroke();

        const flowEntries = flow.master.entries.order.map(flowKey => flow.master.entries.byKey[flowKey])

        staves.forEach(stave => {
            const staveEntries = stave.master.entries.order.map(staveKey => stave.master.entries.byKey[staveKey]);
            let y = config.framePadding.top + metrics.staves[stave.key].y;

            renderStavePrologue(ctx, x, y, config, flowEntries, staveEntries);
        });

    }, [config, instruments, staves, metrics, names, nameWidth, ctx, flow.master.entries.order, flow.master.entries.byKey]);

    useRenderLoop(render);

    return canvas;
}
