import { Instruction, InstructionType } from "./instructions";

export enum Justify {
    start = "flex-start",
    middle = "center",
    end = "flex-end"
}

export enum Align {
    top = "flex-start",
    middle = "center",
    bottom = "flex-end"
}

export interface TextStyles {
    color: string;
    font: string;
    size: number;
    justify: Justify;
    align: Align;
}

export type Text = { styles: TextStyles; value: string; x: number; y: number };
export type TextInstruction = Instruction<Text>;

export function buildText(
    key: string,
    styles: TextStyles,
    x: number,
    y: number,
    value: string
): TextInstruction {
    return {
        key,
        type: InstructionType.text,
        styles,
        x,
        y,
        value
    };
}
