import { Direction } from "./get-stem-direction";

export function getTieDirection(count: number, i: number, stemDirection: Direction) {
    if (count === 1) {
        return stemDirection === Direction.up ? Direction.down : Direction.up;
    } else {
        const middle = Math.ceil(count / 2);
        if (i < middle) {
            return Direction.down;
        } else {
            return Direction.up;
        }
    }
}
