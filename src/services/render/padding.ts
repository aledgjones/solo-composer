import { px } from "./units";

export interface Padding {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export function padding(top: number, right: number, bottom: number, left: number): Padding {
    return {
        top: px(top),
        right: px(right),
        bottom: px(bottom),
        left: px(left)
    }
};