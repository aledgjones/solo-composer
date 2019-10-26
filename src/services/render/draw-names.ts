import { Config } from "../config";
import { Instrument } from "../instrument";
import { SystemMetrics } from "./use-system-metrics";

export function drawNames(ctx: CanvasRenderingContext2D, instruments: Instrument[], names: {[key: string]: string}, metrics: SystemMetrics, config: Config, x: number, nameWidth: number) {
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'right';
    ctx.font = `${config.writeInstrumentNameSize}px ${config.writeInstrumentNameFont}`;
    ctx.textBaseline = 'middle';
    
    instruments.forEach(instrument => {
        const y = config.writePagePadding.top + metrics.instruments[instrument.key].y + (metrics.instruments[instrument.key].height / 2) + 1;
        const name = names[instrument.key];
        ctx.fillText(name, x + nameWidth, y);
    });
}