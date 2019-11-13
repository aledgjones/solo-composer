import { applyStyles } from "./apply-styles";
import { Instruction, InstructionType, MergedInstruction } from "../parse/instructions";

export interface TextStyles {
    color: string;
    fontFamily: string;
    fontSize: number;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
};

export type Text = { value: string, x: number, y: number };
export type TextInstruction = Instruction<{ styles: TextStyles } & Text>;
export type MergedTextInstruction = MergedInstruction<{ styles: TextStyles, texts: Text[] }>;

export function buildText(styles: TextStyles, x: number, y: number, value: string): TextInstruction {
    return {
        type: InstructionType.text,
        styles,
        x,
        y,
        value
    }
}

export function renderTexts(ctx: OffscreenCanvasRenderingContext2D, instruction: MergedTextInstruction) {
    applyStyles(ctx, instruction.styles);
    instruction.texts.forEach(text => {
        ctx.fillText(text.value, text.x, text.y);
    });
}