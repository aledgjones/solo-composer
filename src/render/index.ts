import { RenderInstructions, InstructionType, MergedInstruction } from "../parse/instructions";
import { clearCanvas } from "./clear-canvas";
import { renderPaths } from "./path";
import { renderTexts } from "./text";
import { renderCircles } from "./circle";

export function render(ctx: OffscreenCanvasRenderingContext2D, instructions: RenderInstructions) {

    // resize and clear
    ctx.canvas.height = instructions.height;
    ctx.canvas.width = instructions.width;
    clearCanvas(ctx);

    instructions.layers.score.forEach((instruction: MergedInstruction<any>) => {
        switch (instruction.type) {
            case InstructionType.path:
                renderPaths(ctx, instruction);
                break;
            case InstructionType.text:
                renderTexts(ctx, instruction);
                break;
            case InstructionType.circle:
                renderCircles(ctx, instruction);
                break;
            default:
                break;
        }
    });

}