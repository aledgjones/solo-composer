import shortid from 'shortid';
import { Entry, EntryType } from ".";
import { Instruction } from '../parse/instructions';
import { buildText, TextStyles } from '../render/text';
import { EngravingConfig } from '../services/engraving';
import { Converter } from '../parse/converter';
import { measureText } from '../parse/measure-text';
import { NotationBaseLength } from '../parse/notation-track';
import { buildCircle } from '../render/circle';

export interface AbsoluteTempoDef {
    text?: string;
    beat: NotationBaseLength;
    dotted: boolean;
    beatPerMinute: number;

    parenthesis: boolean;
    textVisible: boolean;
    beatPerMinuteVisible: boolean;
}

export interface AbsoluteTempo extends AbsoluteTempoDef { }

export function createAbsoluteTempo(def: AbsoluteTempoDef, tick: number): Entry<AbsoluteTempo> {
    return {
        _type: EntryType.absoluteTempo,
        _key: shortid(),
        _box: { width: 1, height: 2 },
        _bounds: { width: 1, height: 2 },
        _offset: { top: 0, left: 0 },
        _tick: tick,

        ...def
    }
}

function glyphFromDuration(baseLength?: NotationBaseLength) {
    switch (baseLength) {
        case NotationBaseLength.semiquaver:
            return '\u{1D161}';
        case NotationBaseLength.quaver:
            return '\u{1D160}';
        case NotationBaseLength.crotchet:
            return '\u{1D15F}';
        case NotationBaseLength.minim:
            return '\u{1D15E}';
        case NotationBaseLength.semibreve:
            return '\u{E0A2}';
        default:
            return '';
    }
}

export function drawAbsoluteTempo(x: number, y: number, tempo: Entry<AbsoluteTempo>, config: EngravingConfig, converter: Converter) {

    const instructions: Instruction<any> = [];
    const styles: TextStyles = { color: '#000000', font: config.tempo.font, size: config.tempo.size, align: config.tempo.align, baseline: 'bottom' };

    let left = x;
    let top = y - config.tempo.distanceFromStave;

    if (tempo.textVisible && tempo.text) {
        instructions.push(buildText(styles, left, top, tempo.text));
        left += measureText(styles, tempo.text + ' ', converter);
    }

    if (tempo.beatPerMinuteVisible) {
        // open parens
        if (tempo.parenthesis) {
            instructions.push(buildText(styles, left, top, '('));
            left += measureText(styles, '(', converter);
        }

        // note
        const musicStyles: TextStyles = { ...styles, font: 'Music', size: config.tempo.size + (config.tempo.size * .125), baseline: 'bottom' };
        const glyph = glyphFromDuration(tempo.beat);

        instructions.push(buildText(musicStyles, left, top + (config.tempo.size * .125), glyph));
        left += measureText(musicStyles, glyph, converter);

        // dotted
        if (tempo.dotted) {
            instructions.push(buildCircle({ color: '#000000' }, left + (config.tempo.size * .2), top - (config.tempo.size * .4), config.tempo.size * .0625));
            left += config.tempo.size * .2625;
        }

        // equation
        const equation = ` = ${tempo.beatPerMinute}`;
        instructions.push(buildText(styles, left, top, equation));
        left += measureText(styles, equation, converter);

        // close parens
        if (tempo.parenthesis) {
            instructions.push(buildText(styles, left, top, ')'));
        }
    }

    return instructions;

}