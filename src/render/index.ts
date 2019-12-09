import { RenderInstructions, InstructionType, MergedInstruction } from "../parse/instructions";
import { clearCanvas } from "./clear-canvas";
import { renderPaths } from "./path";
import { renderTexts } from "./text";
import { renderCircles } from "./circle";
import { Converter } from "../parse/converter";

export function resize(ctx: OffscreenCanvasRenderingContext2D, instructions: RenderInstructions, converter: Converter) {
    const px = converter.spaces.toPX;
    const height = px(instructions.height);
    const width = px(instructions.width);
    if (ctx.canvas.height !== height || ctx.canvas.width !== width) {
        ctx.canvas.height = height;
        ctx.canvas.width = width;
        clearCanvas(ctx);
    }
    return { height: ctx.canvas.height, width: ctx.canvas.width };
}

export function render(ctx: OffscreenCanvasRenderingContext2D, instructions: RenderInstructions, converter: Converter) {
    const px = converter.spaces.toPX;

    instructions.entries.forEach((instruction: MergedInstruction<any>) => {
        switch (instruction.type) {
            case InstructionType.path:
                renderPaths(ctx, instruction, px);
                break;
            case InstructionType.text:
                renderTexts(ctx, instruction, px);
                break;
            case InstructionType.circle:
                renderCircles(ctx, instruction, px);
                break;
            default:
                break;
        }
    });

}