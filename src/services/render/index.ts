import { useCallback } from "react";
import { Score } from "../score";
import { FlowKey } from "../flow";
import { useCounts, useInstruments } from "../instrument";
import { clearCanvas } from "./clear-canvas";
import { useMeasureSystem } from "./use-measure-system";
import { drawStaves } from "./draw-staves";
import { useCanvas } from "./use-canvas";
import { useStaves } from "../stave";
import { drawNames } from "./draw-names";
import { useConvertedConfig } from "./useConvertedConfig";
import { renderStavePrologue } from "./render-stave-prologue";
import { useNames } from "./use-name-widths";
import { useRenderLoop } from "./use-render-loop";

export function useRenderWriteMode(score: Score, flowKey: FlowKey) {

    console.time('parse');

    const { canvas, ctx } = useCanvas();

    const config = useConvertedConfig(score.config);

    const flow = score.flows.byKey[flowKey];
    const instruments = useInstruments(score, flow);
    const counts = useCounts(score);
    const staves = useStaves(instruments, flow);
    const { names, max: nameWidth } = useNames(instruments, counts, config, ctx);
    const metrics = useMeasureSystem(instruments, config);

    console.timeEnd('parse');

    const render = useCallback(() => {
        if (!ctx) return undefined;

        console.time('render');

        ctx.canvas.height = config.writePagePadding.top + metrics.systemHeight + config.writePagePadding.bottom;
        clearCanvas(ctx);

        drawStaves(ctx, staves, metrics, config, nameWidth);
        drawNames(ctx, instruments, names, metrics, config, nameWidth);

        const flowEntries = flow.master.entries.order.map(flowKey => flow.master.entries.byKey[flowKey])

        staves.forEach(stave => {

            const staveEntries = stave.master.entries.order.map(staveKey => stave.master.entries.byKey[staveKey]);

            let x = config.writePagePadding.left + nameWidth + config.writeInstrumentNameGap;
            let y = config.writePagePadding.top + metrics.staveYPositions[stave.key];

            ctx.beginPath();
            ctx.moveTo(x, config.writePagePadding.top);
            ctx.lineTo(x, config.writePagePadding.top + metrics.systemHeight);
            ctx.stroke();

            renderStavePrologue(ctx, x, y, config, flowEntries, staveEntries);
        });

        console.timeEnd('render');
        console.log(' ');

    }, [config, instruments, staves, metrics, names, nameWidth, ctx, flow.master.entries.order, flow.master.entries.byKey]);

    useRenderLoop(render);

    return canvas;
}
