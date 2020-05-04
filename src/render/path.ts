import { Instruction, InstructionType } from "./instructions";

export interface PathStyles {
    color: string;
    thickness: number;
}

type CoordX = number;
type CoordY = number;
type PathPoint = [CoordX, CoordY];
type Path = PathPoint[];
export type PathInstruction = Instruction<{ styles: PathStyles; points: Path }>;

export function buildPath(key: string, styles: PathStyles, ...points: Path): PathInstruction {
    return {
        key,
        type: InstructionType.path,
        styles,
        points
    };
}
