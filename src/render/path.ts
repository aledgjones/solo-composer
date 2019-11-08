import { applyStyles, Styles } from "./apply-styles";
import { Instruction, InstructionType } from "./instructions";

export type PointDef = [number, number];
export type PathDef = PointDef[];

export type Path = Instruction<{ points: PointDef[] }>;

export function buildPath(styles: Styles, ...points: PathDef): Path {
    return {
        type: InstructionType.path,
        styles,
        points
    }
}

export function renderPath(ctx: OffscreenCanvasRenderingContext2D, path: Path) {
    applyStyles(ctx, path.styles);
    ctx.beginPath();
    path.points.forEach((point, i) => {
        if (!ctx) return;
        if (i === 0) {
            ctx.moveTo(point[0], point[1]);
        } else {
            ctx.lineTo(point[0], point[1])
        }
    });
    ctx.stroke();
}