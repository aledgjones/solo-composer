import { Instruction, InstructionType } from "../parse/instructions";

export interface CircleStyles {
    color: string;
};

export type Circle = { x: number, y: number, radius: number };
export type CircleInstruction = Instruction<{ styles: CircleStyles } & Circle>;

export function buildCircle(styles: CircleStyles, x: number, y: number, radius: number): CircleInstruction {
    return {
        type: InstructionType.circle,
        styles,
        x,
        y,
        radius
    }
}