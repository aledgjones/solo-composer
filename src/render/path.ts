import { applyStyles } from "./apply-styles";
import { Instruction, InstructionType, MergedInstruction } from "../parse/instructions";

export interface PathStyles { color: string, thickness: number };

export type Point = [number, number];
export type Path = Point[];
export type PathInstruction = Instruction<{ styles: PathStyles, points: Point[] }>;
export type MergedPathInstruction = MergedInstruction<{ styles: PathStyles, paths: Path[] }>;

export function buildPath(styles: PathStyles, ...points: Path): PathInstruction {
    return {
        type: InstructionType.path,
        styles,
        points
    }
}

export function renderPaths(ctx: OffscreenCanvasRenderingContext2D, instruction: MergedPathInstruction, px: (spaces: number) => number) {
    applyStyles(ctx, instruction.styles, px);
    ctx.beginPath();
    instruction.paths.forEach(points => {
        points.forEach((point, i) => {
            if (i === 0) {
                ctx.moveTo(px(point[0]), px(point[1]));
            } else {
                ctx.lineTo(px(point[0]), px(point[1]))
            }
        });
    });
    ctx.stroke();
}