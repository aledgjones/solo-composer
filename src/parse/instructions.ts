import { isEqual } from 'lodash';
import { PathInstruction, MergedPathInstruction } from "../render/path";
import { TextInstruction, MergedTextInstruction } from '../render/text';
import { MergedCircleInstruction, CircleInstruction } from '../render/circle';

export enum InstructionType {
    path = 1,
    text,
    circle
}

export interface InstructionBase {
    type: InstructionType;
}
export type Instruction<T> = InstructionBase & T;
export type MergedInstruction<T> = InstructionBase & T;

export interface RenderInstructions {
    height: number;
    width: number;
    entries: Instruction<any>[];
}

export function mergeInstructions(...instructions: Instruction<any>[]) {
    return instructions.reduce((out: MergedInstruction<any>[], instruction) => {
        let i = out.findIndex(merged => {
            return merged.type === instruction.type && isEqual(merged.styles, instruction.styles);
        });
        if (i > -1) {
            switch (instruction.type) {
                case InstructionType.path: {
                    const entry: MergedPathInstruction = out[i];
                    const path: PathInstruction = instruction;
                    entry.paths.push(path.points);
                    break;
                }
                case InstructionType.text: {
                    const entry: MergedTextInstruction = out[i];
                    const text: TextInstruction = instruction;
                    entry.texts.push({ value: text.value, x: text.x, y: text.y });
                    break;
                }
                case InstructionType.circle: {
                    const entry: MergedCircleInstruction = out[i];
                    const circle: CircleInstruction = instruction;
                    entry.circles.push({ x: circle.x, y: circle.y, radius: circle.radius });
                    break;
                }
                default:
                    break;
            }
        } else {
            switch (instruction.type) {
                case InstructionType.path: {
                    const path: PathInstruction = instruction;
                    const entry: MergedPathInstruction = {
                        type: InstructionType.path,
                        styles: path.styles,
                        paths: [path.points]
                    };
                    out.push(entry);
                    break;
                }
                case InstructionType.text: {
                    const text: TextInstruction = instruction;
                    const entry: MergedTextInstruction = {
                        type: InstructionType.text,
                        styles: text.styles,
                        texts: [{ value: text.value, x: text.x, y: text.y }]
                    };
                    out.push(entry);
                    break;
                }
                case InstructionType.circle: {
                    const circle: CircleInstruction = instruction;
                    const entry: MergedCircleInstruction = {
                        type: InstructionType.circle,
                        styles: circle.styles,
                        circles: [{ x: circle.x, y: circle.y, radius: circle.radius }]
                    };
                    out.push(entry);
                    break;
                }
                default:
                    break;
            }
        }
        return out;
    }, []);
}