import shortid from "shortid";
import { Entry, EntryType, Box } from ".";
import { VerticalMeasurements } from "../parse/measure-vertical-layout";
import { buildPath } from "../render/path";
import { Stave } from "../services/stave";
import { Instruction } from "../render/instructions";
import { buildCircle } from "../render/circle";

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

export interface Barline extends BarlineDef {}

function measureBarlineBox(type: BarlineType): Box {
    switch (type) {
        case BarlineType.double:
            return { width: 0.5, height: 4 };
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

function measureBarlineBounds(type: BarlineType): Box {
    switch (type) {
        case BarlineType.double:
            return { width: 1.5, height: 4 };
        case BarlineType.final:
            return { width: 1, height: 4 };
        case BarlineType.start_repeat:
        case BarlineType.end_repeat:
            return { width: 3, height: 4 };
        case BarlineType.normal:
        default:
            return { width: 1, height: 4 };
    }
}

export function createBarline(def: BarlineDef, tick: number): Entry<Barline> {
    return {
        _type: EntryType.barline,
        _key: shortid(),
        _box: measureBarlineBox(def.type),
        _bounds: measureBarlineBounds(def.type),
        _offset: { top: 0, left: 0 },
        _tick: tick,

        ...def
    };
}

export function drawBarline(
    x: number,
    y: number,
    staves: Stave[],
    metrics: VerticalMeasurements,
    barline: Entry<Barline>
) {
    const instructions: Instruction<any> = [];

    metrics.barlines.forEach(entry => {
        const start = metrics.instruments[entry.start];
        const stop = metrics.instruments[entry.stop];

        const tweakForStaveLineWidth = 0.0625;
        const top = y + start.y - tweakForStaveLineWidth;
        const bottom = y + stop.y + stop.height + tweakForStaveLineWidth;

        switch (barline.type) {
            case BarlineType.double:
                instructions.push(
                    buildPath(
                        `${barline._key}-${entry.start}-barline--1`,
                        { color: "#000000", thickness: 0.125 },
                        [x, top],
                        [x, bottom]
                    )
                );
                instructions.push(
                    buildPath(
                        `${barline._key}-${entry.start}-barline--2`,
                        { color: "#000000", thickness: 0.125 },
                        [x + 0.5, top],
                        [x + 0.5, bottom]
                    )
                );
                break;

            case BarlineType.final:
                instructions.push(
                    buildPath(
                        `${barline._key}-${entry.start}-barline--thin`,
                        { color: "#000000", thickness: 0.125 },
                        [x, top],
                        [x, bottom]
                    )
                );
                instructions.push(
                    buildPath(
                        `${barline._key}-${entry.start}-barline--thick`,
                        { color: "#000000", thickness: 0.5 },
                        [x + 0.75, top],
                        [x + 0.75, bottom]
                    )
                );
                break;

            case BarlineType.end_repeat:
                instructions.push(
                    buildPath(
                        `${barline._key}-${entry.start}-barline--thin`,
                        { color: "#000000", thickness: 0.125 },
                        [x + 1, top],
                        [x + 1, bottom]
                    )
                );
                instructions.push(
                    buildPath(
                        `${barline._key}-${entry.start}-barline--thick`,
                        { color: "#000000", thickness: 0.5 },
                        [x + 1.75, top],
                        [x + 1.75, bottom]
                    )
                );
                break;

            case BarlineType.start_repeat:
                instructions.push(
                    buildPath(
                        `${barline._key}-${entry.start}-barline--thin`,
                        { color: "#000000", thickness: 0.125 },
                        [x + 1, top],
                        [x + 1, bottom]
                    )
                );
                instructions.push(
                    buildPath(
                        `${barline._key}-${entry.start}-barline--thick`,
                        { color: "#000000", thickness: 0.5 },
                        [x + 0.25, top],
                        [x + 0.25, bottom]
                    )
                );
                break;

            case BarlineType.normal:
            default:
                instructions.push(
                    buildPath(
                        `${barline._key}-${entry.start}-barline`,
                        { color: "#000000", thickness: 0.125 },
                        [x, top],
                        [x, bottom]
                    )
                );
                break;
        }

        if (barline.type === BarlineType.start_repeat || barline.type === BarlineType.end_repeat) {
            const radius = 0.25;
            const left = barline.type === BarlineType.start_repeat ? x + 1.75 : x + 0.25;
            staves.forEach(stave => {
                const top = metrics.staves[stave.key].y;
                instructions.push(
                    buildCircle(
                        `${barline._key}-${stave.key}-dot--top`,
                        { color: "#000000" },
                        left,
                        y + top + 1.5,
                        radius
                    )
                );
                instructions.push(
                    buildCircle(
                        `${barline._key}-${stave.key}-dot--bottom`,
                        { color: "#000000" },
                        left,
                        y + top + 2.5,
                        radius
                    )
                );
            });
        }
    });

    return instructions;
}
