import { RenderInstructions, InstructionType, MergedInstruction } from "../parse/instructions";
import { clearCanvas } from "./clear-canvas";
import { renderPaths } from "./path";
import { renderTexts } from "./text";
import { renderCircles } from "./circle";
import { Converter } from "../parse/converter";

export function render(ctx: OffscreenCanvasRenderingContext2D, instructions: RenderInstructions, converter: Converter) {

    const px = converter.spaces.toPX;

    ctx.canvas.height = px(instructions.height);
    ctx.canvas.width = px(instructions.width);
    clearCanvas(ctx);

    instructions.layers.score.forEach((instruction: MergedInstruction<any>) => {
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