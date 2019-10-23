import { Config } from "../config";
import { Instrument } from "../instrument";
import { SystemMetrics } from "./use-measure-system";

export function drawNames(ctx: CanvasRenderingContext2D, instruments: Instrument[], names: {[key: string]: string}, metrics: SystemMetrics, config: Config, nameWidth: number) {
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'right';
    ctx.font = `${config.writeInstrumentNameSize}px ${config.writeInstrumentNameFont}`;
    ctx.textBaseline = 'middle';
    
    instruments.forEach(instrument => {
        const x = config.writePagePadding.left + nameWidth;
        const y = config.writePagePadding.top + metrics.instrumentYPositions[instrument.key] + (metrics.instrumentHeights[instrument.key] / 2) + 1;
        const name = names[instrument.key];
        ctx.fillText(name, x, y);
    });
}