import { Instruction, InstructionType } from "./instructions";

export interface CircleStyles {
    color: string;
}

export type Circle = { styles: CircleStyles; x: number; y: number; radius: number };
export type CircleInstruction = Instruction<Circle>;

export function buildCircle(
    key: string,
    styles: CircleStyles,
    x: number,
    y: number,
    radius: number
): CircleInstruction {
    return {
        key,
        type: InstructionType.circle,
        styles,
        x,
        y,
        radius
    };
}
