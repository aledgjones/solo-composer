import { Instrument } from "../instrument";
import { SystemMetrics } from "./use-system-metrics";
import { EngravingConfig } from "../engraving";

export function drawNames(ctx: CanvasRenderingContext2D, x: number, instruments: Instrument[], names: {[key: string]: string}, metrics: SystemMetrics, config: EngravingConfig) {
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'right';
    ctx.font = `${config.staveInstrumentNameSize}px ${config.staveInstrumentNameFont}`;
    ctx.textBaseline = 'middle';
    
    instruments.forEach(instrument => {
        const y = config.framePadding.top + metrics.instruments[instrument.key].y + (metrics.instruments[instrument.key].height / 2) + 1;
        const name = names[instrument.key];
        ctx.fillText(name, x, y);
    });
}