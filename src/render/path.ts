import { Instruction, InstructionType } from "./instructions";

export interface PathStyles { color: string, thickness: number };

export type Point = [number, number];
export type Path = Point[];
export type PathInstruction = Instruction<{ styles: PathStyles, points: Point[] }>;

export function buildPath(key: string, styles: PathStyles, ...points: Path): PathInstruction {
    return {
        key,
        type: InstructionType.path,
        styles,
        points
    }
}