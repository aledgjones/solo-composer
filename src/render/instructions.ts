import { Styles } from "./apply-styles";

export enum InstructionType {
    path = 1,
    text
}

export interface InstructionBase {
    type: InstructionType;
    styles: Styles;
}
export type Instruction<T> = InstructionBase & T;

export type RenderLayers = {
    debug: Instruction<any>[];
    score: Instruction<any>[];
    selection: Instruction<any>[];
}

export interface RenderInstructions {
    height: number;
    width: number;
    layers: RenderLayers
}