import shortid from 'shortid';
import { Entry, EntryType, Box } from ".";
import { SystemMetrics } from '../services/render/use-measure-system';
import { Converter } from '../services/render/use-converter';
import { DEBUG } from '../services/state';

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

function measureBarlineBox(type: BarlineType): Box {
    switch (type) {
        case BarlineType.double:
            return { width: .5, height: 4 };
        case BarlineType.final:
            return { width: 1, height: 4 };
        case BarlineType.start_repeat:
        case BarlineType.end_repeat:
            return { width: 2, height: 4 };
        case BarlineType.normal:
        default:
            return { width: 0, height: 4 };
    }
}

export function createBarline(def: BarlineDef, tick: number): Entry<Barline> {
    return {
        _type: EntryType.barline,
        _key: shortid(),
        _box: measureBarlineBox(def.type),
        _bounds: measureBarlineBox(def.type),
        _offset: { top: 0, left: 0 },
        _tick: tick,

        ...def
    }
}

export function drawBarline(ctx: CanvasRenderingContext2D, x: number, y: number, metrics: SystemMetrics, barline: Entry<Barline>, converter: Converter) {

    const { spaces } = converter;

    metrics.barlines.forEach(entry => {

        const start = metrics.instruments[entry.start];
        const stop = metrics.instruments[entry.stop];

        const tweakForStaveLineWidth = spaces.toPX(.0625);
        const top = y + start.y - tweakForStaveLineWidth;
        const bottom = y + stop.y + stop.height + tweakForStaveLineWidth;

        if (DEBUG) {
            ctx.fillStyle = 'rgba(100, 0, 255, .4)';
            ctx.fillRect(x, top, spaces.toPX(barline._box.width), bottom - top);
            ctx.fillStyle = 'rgba(100, 0, 255, .2)';
            ctx.fillRect(x, top, spaces.toPX(barline._bounds.width), bottom - top);
        }

        ctx.strokeStyle = '#000000';

        switch (barline.type) {

            case BarlineType.double:

                ctx.lineWidth = spaces.toPX(.125);
                ctx.beginPath();
                ctx.moveTo(x, top);
                ctx.lineTo(x, bottom);
                ctx.moveTo(x + spaces.toPX(.5), top);
                ctx.lineTo(x + spaces.toPX(.5), bottom);
                ctx.stroke();
                break;

            case BarlineType.final:

                ctx.lineWidth = spaces.toPX(.125);
                ctx.beginPath();
                ctx.moveTo(x, top);
                ctx.lineTo(x, bottom);
                ctx.stroke();

                ctx.lineWidth = spaces.toPX(.5);
                ctx.beginPath();
                ctx.moveTo(x + spaces.toPX(.75), top);
                ctx.lineTo(x + spaces.toPX(.75), bottom);
                ctx.stroke();
                break;

            case BarlineType.end_repeat:

                ctx.lineWidth = spaces.toPX(.125);
                ctx.beginPath();
                ctx.moveTo(x + spaces.toPX(1), top);
                ctx.lineTo(x + spaces.toPX(1), bottom);
                ctx.stroke();

                ctx.lineWidth = spaces.toPX(.5);
                ctx.beginPath();
                ctx.moveTo(x + spaces.toPX(1.75), top);
                ctx.lineTo(x + spaces.toPX(1.75), bottom);
                ctx.stroke();
                break;

            case BarlineType.start_repeat:

                ctx.lineWidth = spaces.toPX(.5);
                ctx.beginPath();
                ctx.moveTo(x + spaces.toPX(.25), top);
                ctx.lineTo(x + spaces.toPX(.25), bottom);
                ctx.stroke();

                ctx.lineWidth = spaces.toPX(.125);
                ctx.beginPath();
                ctx.moveTo(x + spaces.toPX(1), top);
                ctx.lineTo(x + spaces.toPX(1), bottom);
                ctx.stroke();
                break;

            case BarlineType.normal:
            default:

                ctx.lineWidth = spaces.toPX(.125);
                ctx.beginPath();
                ctx.moveTo(x, top);
                ctx.lineTo(x, bottom);
                ctx.stroke();
                break;

        }

        const keys = Object.keys(metrics.staves);
        const radius = spaces.toPX(.25);
        const startAngle = 0;
        const endAngle = Math.PI * 2;

        ctx.fillStyle = '#000000';

        if (barline.type === BarlineType.end_repeat) {
            const left = x + spaces.toPX(.25);
            ctx.beginPath();
            keys.forEach(key => {
                const stave = metrics.staves[key];
                ctx.arc(left, y + stave.y + spaces.toPX(1.5), radius, startAngle, endAngle);
                ctx.arc(left, y + stave.y + spaces.toPX(2.5), radius, startAngle, endAngle);
            });
            ctx.fill();
        }

        if (barline.type === BarlineType.start_repeat) {
            const left = x + spaces.toPX(1.75);
            ctx.beginPath();
            keys.forEach(key => {
                const stave = metrics.staves[key];
                ctx.arc(left, y + stave.y + spaces.toPX(1.5), radius, startAngle, endAngle);
                ctx.arc(left, y + stave.y + spaces.toPX(2.5), radius, startAngle, endAngle);
            });
            ctx.fill();
        }

    });

}