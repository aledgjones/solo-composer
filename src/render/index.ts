import { RenderInstructions, Instruction, InstructionType } from "./instructions";
import { clearCanvas } from "./clear-canvas";
import { renderPath } from "./path";
import { renderText } from "./text";

export function render(ctx: OffscreenCanvasRenderingContext2D, instructions: RenderInstructions) {

    // resize and clear
    ctx.canvas.height = instructions.height;
    ctx.canvas.width = instructions.width;
    clearCanvas(ctx);

    // TODO for each layer, batch all instructions with the same type and styles
    // minimise style allocation and stroking.

    instructions.layers.score.forEach((instruction: Instruction<any>) => {
        switch (instruction.type) {
            case InstructionType.path:
                renderPath(ctx, instruction);
                break;
            case InstructionType.text:
                renderText(ctx, instruction);
            default:
                break;
        }
    });
}