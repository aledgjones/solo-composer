import shortid from 'shortid';
import { Entry, EntryType, Box } from ".";
import { VerticalMeasurements } from '../parse/measure-vertical-layout';
import { Converter } from '../parse/converter';
import { DEBUG } from '../services/state';
import { buildPath } from '../render/path';
import { Stave } from '../services/stave';
import { Instruction } from '../parse/instructions';
import { buildCircle } from '../render/circle';

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

export function drawBarline(x: number, y: number, staves: Stave[], metrics: VerticalMeasurements, barline: Entry<Barline>, converter: Converter) {

    const { spaces } = converter;
    const instructions: Instruction<any> = [];

    metrics.barlines.forEach(entry => {

        const start = metrics.instruments[entry.start];
        const stop = metrics.instruments[entry.stop];

        const tweakForStaveLineWidth = spaces.toPX(.0625);
        const top = y + start.y - tweakForStaveLineWidth;
        const bottom = y + stop.y + stop.height + tweakForStaveLineWidth;

        if (DEBUG) {
            // ctx.fillStyle = 'rgba(100, 0, 255, .4)';
            // ctx.fillRect(x, top, spaces.toPX(barline._box.width), bottom - top);
            // ctx.fillStyle = 'rgba(100, 0, 255, .2)';
            // ctx.fillRect(x, top, spaces.toPX(barline._bounds.width), bottom - top);
        }

        switch (barline.type) {

            case BarlineType.double:

                instructions.push(buildPath({ color: '#000000', thickness: spaces.toPX(.125) },
                    [x, top],
                    [x, bottom],
                ));
                instructions.push(buildPath({ color: '#000000', thickness: spaces.toPX(.125) },
                    [x + spaces.toPX(.5), top],
                    [x + spaces.toPX(.5), bottom]
                ));
                break;

            case BarlineType.final:
                instructions.push(buildPath({ color: '#000000', thickness: spaces.toPX(.125) },
                    [x, top],
                    [x, bottom]
                ));
                instructions.push(buildPath({ color: '#000000', thickness: spaces.toPX(.5) },
                    [x + spaces.toPX(.75), top],
                    [x + spaces.toPX(.75), bottom]
                ));
                break;

            case BarlineType.end_repeat:
                instructions.push(buildPath({ color: '#000000', thickness: spaces.toPX(.125) },
                    [x + spaces.toPX(1), top],
                    [x + spaces.toPX(1), bottom]
                ));
                instructions.push(buildPath({ color: '#000000', thickness: spaces.toPX(.5) },
                    [x + spaces.toPX(1.75), top],
                    [x + spaces.toPX(1.75), bottom]
                ));
                break;

            case BarlineType.start_repeat:
                instructions.push(buildPath({ color: '#000000', thickness: spaces.toPX(.125) },
                    [x + spaces.toPX(1), top],
                    [x + spaces.toPX(1), bottom]
                ));
                instructions.push(buildPath({ color: '#000000', thickness: spaces.toPX(.5) },
                    [x + spaces.toPX(.25), top],
                    [x + spaces.toPX(.25), bottom]
                ));
                break;

            case BarlineType.normal:
            default:
                instructions.push(buildPath({ color: '#000000', thickness: spaces.toPX(.125) },
                    [x, top],
                    [x, bottom]
                ));
                break;

        }

        if (barline.type === BarlineType.start_repeat || barline.type === BarlineType.end_repeat) {
            const radius = spaces.toPX(.25);
            const left = barline.type === BarlineType.start_repeat ? x + spaces.toPX(1.75) : x + spaces.toPX(.25);
            staves.forEach(stave => {
                const top = metrics.staves[stave.key].y;
                instructions.push(buildCircle({ color: '#000000' }, left, y + top + spaces.toPX(1.5), radius));
                instructions.push(buildCircle({ color: '#000000' }, left, y + top + spaces.toPX(2.5), radius));
            });
        }

    });

    return instructions;

}