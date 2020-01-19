import shortid from 'shortid';
import { Entry, EntryType } from ".";
import { Instruction } from '../parse/instructions';
import { buildText, TextStyles } from '../render/text';
import { EngravingConfig } from '../services/engraving';
import { Converter } from '../parse/converter';
import { NotationBaseLength } from '../parse/notation-track';
import { Align } from '../render/apply-styles';

export interface AbsoluteTempoDef {
    text?: string;
    beat: NotationBaseLength;
    dotted: number;
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
    const styles: TextStyles = { color: '#000000', font: config.tempo.font, size: config.tempo.size, justify: config.tempo.align, align: Align.bottom };

    let left = x;
    let top = y - config.tempo.distanceFromStave - config.tempo.size;
    let output = '';

    if (tempo.textVisible && tempo.text) {
        output += `${tempo.text} `;
    }

    if (tempo.beatPerMinuteVisible) {
        // open parens
        if (tempo.parenthesis) {
            output += '(';
        }

        const glyph = glyphFromDuration(tempo.beat);
        output += `@${glyph}`;

        // dotted
        if (tempo.dotted > 0) {
            for (let i = 0; i < tempo.dotted; i++) {
                output += '\u{E1E7}';
            }
        }

        output += '@';

        // equation
        output += ` = ${tempo.beatPerMinute}`;

        // close parens
        if (tempo.parenthesis) {
            output += ')';
        }
    }

    return buildText(styles, left, top, output);

}