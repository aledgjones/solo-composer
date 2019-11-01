import { Stave } from "../stave";
import { SystemMetrics } from "./use-measure-system";
import { EngravingConfig } from "../engraving";
import { Converter } from "./use-converter";

export function drawStaves(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, staves: Stave[], metrics: SystemMetrics, config: EngravingConfig, converter: Converter) {

    const { spaces } = converter;

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = spaces.toPX(.125);

    const tweakForStaveLineWidth = converter.spaces.toPX(.0625);

    ctx.beginPath();
    staves.forEach(stave => {
        for (let i = 0; i < 5; i++) {
            const start = y + metrics.staves[stave.key].y + spaces.toPX(i);
            ctx.moveTo(x, start);
            ctx.lineTo(x + width, start);
        }
    });

    ctx.moveTo(x, y - tweakForStaveLineWidth);
    ctx.lineTo(x, y + metrics.systemHeight + tweakForStaveLineWidth);
    ctx.stroke();

}