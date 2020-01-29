export enum InstructionType {
    path = 1,
    text,
    circle
}

export interface InstructionBase {
    key: string;
    type: InstructionType;
}
export type Instruction<T> = InstructionBase & T;

export interface RenderInstructions {
    space: number, // px to 1 space
    height: number;
    width: number;
    entries: Instruction<any>[];
}