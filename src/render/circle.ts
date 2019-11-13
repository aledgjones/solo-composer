import { applyStyles } from "./apply-styles";
import { Instruction, InstructionType, MergedInstruction } from "../parse/instructions";

export interface CircleStyles {
    color: string;
};

export type Circle = { x: number, y: number, radius: number };
export type CircleInstruction = Instruction<{ styles: CircleStyles } & Circle>;
export type MergedCircleInstruction = MergedInstruction<{ styles: CircleStyles, circles: Circle[] }>;

export function buildCircle(styles: CircleStyles, x: number, y: number, radius: number): CircleInstruction {
    return {
        type: InstructionType.circle,
        styles,
        x,
        y,
        radius
    }
}

export function renderCircles(ctx: OffscreenCanvasRenderingContext2D, instruction: MergedCircleInstruction) {
    applyStyles(ctx, instruction.styles);
    instruction.circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}