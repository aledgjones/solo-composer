import { Direction } from "./get-stem-direction";

export function getTieDirection(count: number, i: number, stemDirection: Direction) {
    if (count === 1) {
        return stemDirection === Direction.up ? Direction.down : Direction.up;
    } else {
        let middle = 0;
        // majority away from stem
        if (stemDirection === Direction.up) {
            middle = Math.ceil(count / 2);
        } else {
            middle = Math.floor(count / 2);
        }
        if (i < middle) {
            return Direction.down;
        } else {
            return Direction.up;
        }
    }
}
