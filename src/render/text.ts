import { applyStyles, Styles } from "./apply-styles";
import { Instruction, InstructionType } from "./instructions";

export type Text = Instruction<{ value: string, x: number, y: number }>

export function buildText(styles: Styles, x: number, y: number, value: string): Text {
    return {
        type: InstructionType.text,
        styles,
        x,
        y,
        value
    }
}

export function renderText(ctx: OffscreenCanvasRenderingContext2D, text: Text) {
    applyStyles(ctx, text.styles);
    ctx.fillText(text.value, text.x, text.y);
}