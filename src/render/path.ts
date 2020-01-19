import { Instruction, InstructionType } from "../parse/instructions";

export interface PathStyles { color: string, thickness: number };

export type Point = [number, number];
export type Path = Point[];
export type PathInstruction = Instruction<{ styles: PathStyles, points: Point[] }>;

export function buildPath(styles: PathStyles, ...points: Path): PathInstruction {
    return {
        type: InstructionType.path,
        styles,
        points
    }
}