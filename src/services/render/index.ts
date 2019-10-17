import { useEffect } from "react";
import { Score } from "../score";
import { FlowKey } from "../flow";
import { useCounts, useInstruments } from "../instrument";
import { measureText } from "./measure-text";
import { clearCanvas } from "./clear-canvas";
import { measureSystem } from "./measure-system";
import { drawStaves } from "./draw-staves";
import { useCanvas } from "./use-canvas";
import { useStaves } from "../stave";
import { drawNames } from "./draw-names";
import { drawClef, Clef } from "../entries/clef";
import { findPreviousOfType } from "./find-previous-of-type";
import { EntryType } from "../entries";

export function useRenderWriteMode(score: Score, flowKey: FlowKey) {

    const { canvas, ctx } = useCanvas(200, 200);

    const config = score.config;
    const flow = score.flows.byKey[flowKey];

    const counts = useCounts(score);
    const instruments = useInstruments(score, flow);
    const staves = useStaves(instruments, flow);

    useEffect(() => {

        if (!ctx) return undefined;

        const names = instruments.reduce((output: { [key: string]: string }, instrument) => {
            const count = counts[instrument.key] ? ` ${counts[instrument.key]}` : '';
            output[instrument.key] = instrument.longName + count;
            return output;
        }, {});
        const widths = instruments.map(instrument => measureText(names[instrument.key], `${config.writeInstrumentNameSize}px ${config.writeInstrumentNameFont}`, ctx));
        const nameWidth = Math.max(...widths);

        const metrics = measureSystem(instruments, config);
        ctx.canvas.height = config.writePagePadding.top + metrics.systemHeight + config.writePagePadding.bottom;
        clearCanvas(ctx);

        drawStaves(ctx, staves, metrics, config, nameWidth);
        drawNames(ctx, instruments, names, metrics, config, nameWidth);

        staves.forEach(stave => {

            const staveEntries = stave.master.entries.order.map(staveKey => stave.master.entries.byKey[staveKey]);
            const clef = findPreviousOfType<Clef>(EntryType.clef, 0, staveEntries);
            // const key = ;
            // const time = ;

            // const width = drawSystemPrologue(ctx, clef, key, time, true);

            const x = config.writePagePadding.left + nameWidth + config.writeInstrumentNameGap

            ctx.beginPath();
            ctx.moveTo(x, config.writePagePadding.top);
            ctx.lineTo(x, config.writePagePadding.top + metrics.systemHeight);
            ctx.stroke();

            if (clef) {
                const x = config.writePagePadding.left + config.writeSystemStartPadding + nameWidth + config.writeInstrumentNameGap;
                const y = config.writePagePadding.top + metrics.staveYPositions[stave.key];
                drawClef(ctx, x, y, config.writeStaveSize, clef.type, clef.offset);
            }
        });

        console.timeEnd('render');

    }, [config, instruments, staves, counts, ctx]);

    return canvas;
}
