import shortid from 'shortid';
import { Entry, EntryType } from ".";
import { SystemMetrics } from '../render/use-system-metrics';

export enum BarlineType {
    NORMAL = 1,
    DOUBLE,
    FINAL,
    START_REPEAT,
    END_REPEAT,
    END_START_REPEAT
}

export interface BarlineDef {
    type: BarlineType;
}

export interface Barline extends BarlineDef { }

export function createBarline(def: BarlineDef, tick: number): Entry<Barline> {
    return {
        _type: EntryType.barline,
        _key: shortid(),
        _box: { width: 7, height: 8 },
        _offset: { top: 0, left: 0 },
        _tick: tick,

        ...def
    }
}

export function drawBarline(ctx: CanvasRenderingContext2D, space: number, metrics: SystemMetrics, type: BarlineType) {
    // ctx.fillText(glyph, x, y + (space * offset));
}