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
import { useConvertedConfig } from "./use-converted-config";
import { renderStavePrologue } from "./stave-prologue";
import { useNames } from "./use-names";
import { useRenderLoop } from "./use-render-loop";
import { drawBraces } from "./draw-braces";
import { drawBrackets } from "./draw-brackets";
import { calcBracketAndBracesWidth } from "./calc-bracket-and-braces-width";
import { drawSubBrackets } from "./draw-sub-brackets";
import { defaultEngravingConfig } from "../engraving";
import { useConverter } from "./use-converter";
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
    const metrics = useSystemMetrics(instruments, config);

    const render = useCallback(() => {
        if (!ctx) return undefined;

        ctx.canvas.height = config.framePadding.top + metrics.systemHeight + config.framePadding.bottom;
        clearCanvas(ctx);

        const y = config.framePadding.top;
        let x = config.framePadding.left;
        drawNames(ctx, x + nameWidth, instruments, names, metrics, config);
        x = x + nameWidth + config.staveInstrumentNameGap + calcBracketAndBracesWidth(metrics, converter);

        drawBraces(ctx, metrics, config, x);
        drawBrackets(ctx, x, y, metrics, config, converter);
        drawSubBrackets(ctx, x, y, metrics, config, converter);

        const width = ctx.canvas.width - x - config.framePadding.right; // this is calculated from stave entries
        drawStaves(ctx, x, y, width, staves, metrics, config, converter);

        const tweakForStaveLineWidth = converter.spaces.toPX(.0625);

        ctx.beginPath();
        ctx.moveTo(x, config.framePadding.top - tweakForStaveLineWidth);
        ctx.lineTo(x, config.framePadding.top + metrics.systemHeight + tweakForStaveLineWidth);
        ctx.stroke();

        const flowEntries = flow.master.entries.order.map(flowKey => flow.master.entries.byKey[flowKey])

        staves.forEach(stave => {
            const staveEntries = stave.master.entries.order.map(staveKey => stave.master.entries.byKey[staveKey]);
            let y = config.framePadding.top + metrics.staves[stave.key].y;

            renderStavePrologue(ctx, x, y, config, flowEntries, staveEntries, converter);
        });

        const barline = createBarline({type: BarlineType.final}, 0);
        drawBarline(ctx, x + width - converter.spaces.toPX(.75), y, metrics, barline, converter);

    }, [config, instruments, staves, metrics, names, nameWidth, ctx, flow.master.entries.order, flow.master.entries.byKey]);

    useRenderLoop(render);

    return canvas;
}
