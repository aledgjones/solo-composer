import { Instruction, InstructionType } from "../parse/instructions";
import { Justify, Align } from "./apply-styles";

export interface TextStyles {
    color: string;
    font: string;
    size: number;
    justify: Justify;
    align: Align;
};

export type Text = { value: string, x: number, y: number };
export type TextInstruction = Instruction<{ styles: TextStyles } & Text>;

export function buildText(styles: TextStyles, x: number, y: number, value: string): TextInstruction {
    return {
        type: InstructionType.text,
        styles,
        x,
        y,
        value
    }
}