import shortid from 'shortid';
import { Entry, EntryType } from ".";
import { SystemMetrics } from '../render/use-measure-system';
import { Converter } from '../render/use-converter';

export enum BarlineType {
    normal = 1,
    double,
    final,
    start_repeat,
    end_repeat,
    end_start_repeat
}

export interface BarlineDef {
    type: BarlineType;
}

export interface Barline extends BarlineDef { }

export function createBarline(def: BarlineDef, tick: number): Entry<Barline> {
    return {
        _type: EntryType.barline,
        _key: shortid(),
        _box: { width: 1, height: 4 },
        _bounds: { width: 1, height: 4 },
        _offset: { top: 0, left: 0 },
        _tick: tick,

        ...def
    }
}

export function drawBarline(ctx: CanvasRenderingContext2D, x: number, y: number, metrics: SystemMetrics, barline: Entry<Barline>, converter: Converter) {

    const { spaces } = converter;

    const thinLineWidth = spaces.toPX(.125);
    const thickLineWidth = spaces.toPX(.5);
    const spaceWidth = spaces.toPX(.5);

    ctx.strokeStyle = '#000000';

    metrics.barlines.forEach(entry => {

        const start = metrics.instruments[entry.start];
        const stop = metrics.instruments[entry.stop];

        const tweakForStaveLineWidth = spaces.toPX(.0625);
        const top = y + start.y - tweakForStaveLineWidth;
        const bottom = y + stop.y + stop.height + tweakForStaveLineWidth;

        if (barline.type === BarlineType.normal) {
            ctx.lineWidth = thinLineWidth;
            ctx.beginPath();
            ctx.moveTo(x, top);
            ctx.lineTo(x, bottom);
            ctx.stroke();
        }

        if (barline.type === BarlineType.double) {
            ctx.lineWidth = thinLineWidth;
            ctx.beginPath();
            ctx.moveTo(x, top);
            ctx.lineTo(x, bottom);
            ctx.moveTo(x + spaceWidth, top);
            ctx.lineTo(x + spaceWidth, bottom);
            ctx.stroke();
        }

        if (barline.type === BarlineType.final) {
            ctx.lineWidth = thinLineWidth;
            ctx.beginPath();
            ctx.moveTo(x, top);
            ctx.lineTo(x, bottom);
            ctx.stroke();

            ctx.lineWidth = thickLineWidth;
            ctx.beginPath();
            ctx.moveTo(x + spaceWidth + (thickLineWidth / 2), top);
            ctx.lineTo(x + spaceWidth + (thickLineWidth / 2), bottom);
            ctx.stroke();
        }

    });

}