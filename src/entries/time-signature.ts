import shortid from "shortid";
import { Entry, EntryType } from ".";
import { TextStyles, buildText, Justify, Align } from "../render/text";

export interface TimeSignatureDef {
    beats: number; // 0 = free
    beatType: number; // if free this helps the splitting rules
    groupings: number[];
    drawAs?: "c" | "splitc" | "X"; // free will not be drawn unless X is stated
}

export interface TimeSignature extends TimeSignatureDef {}

export function createTimeSignature(def: TimeSignatureDef, tick: number): Entry<TimeSignature> {
    // we hide if we have a free time sig and we dont write it as X
    const isHidden = def.beats === 0 && !def.drawAs;
    return {
        _type: EntryType.timeSignature,
        _key: shortid(),
        _box: { width: isHidden ? 0 : 1.75, height: 4 },
        _bounds: { width: isHidden ? 0 : 1.75 + 1.5, height: 4 },
        _offset: { top: 0, left: 0 },
        _tick: tick,

        ...def
    };
}

function glyphFromType(val: string) {
    switch (val) {
        case "0":
            return "\u{E080}";
        case "1":
            return "\u{E081}";
        case "2":
            return "\u{E082}";
        case "3":
            return "\u{E083}";
        case "4":
            return "\u{E084}";
        case "5":
            return "\u{E085}";
        case "6":
            return "\u{E086}";
        case "7":
            return "\u{E087}";
        case "8":
            return "\u{E088}";
        case "9":
            return "\u{E059}";
        case "c":
            return "\u{E08A}";
        case "splitc":
            return "\u{E08B}";
        case "X":
            return "\u{E09C}";
        default:
            return "\u{E08A}";
    }
}

export function drawTimeSignature(x: number, y: number, time: Entry<TimeSignature>, staveKey: string) {
    const instructions = [];
    const styles: TextStyles = {
        color: "#000000",
        font: "Music",
        size: 4,
        justify: Justify.start,
        align: Align.middle
    };

    if (time.drawAs) {
        const glyph = glyphFromType(time.drawAs);
        instructions.push(buildText(time._key, styles, x, y + 2, glyph));
    } else if (time.beats !== 0) {
        const countGlyph = glyphFromType(time.beats.toString());
        const beatGlyph = glyphFromType(time.beatType.toString());
        instructions.push(buildText(`${time._key}-${staveKey}-count`, styles, x, y + 1, countGlyph));
        instructions.push(buildText(`${time._key}-${staveKey}-beat`, styles, x, y + 3, beatGlyph));
    }

    return instructions;
}
