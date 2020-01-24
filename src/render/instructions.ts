export enum InstructionType {
    path = 1,
    text,
    circle
}

export interface InstructionBase {
    type: InstructionType;
}
export type Instruction<T> = InstructionBase & T;

export interface RenderInstructions {
    height: number;
    width: number;
    entries: Instruction<any>[];
}