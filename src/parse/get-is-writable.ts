import { NotationBaseLength } from "./notation-track";

function isWritable(duration: number, subdivisions: number) {
    switch (duration / subdivisions) {
        case NotationBaseLength.semiquaver:
        case NotationBaseLength.quaver:
        case NotationBaseLength.crotchet:
        case NotationBaseLength.minim:
        case NotationBaseLength.semibreve:
        case NotationBaseLength.breve:
            return true;
        default:
            return false;
    }

}

export function getIsWritable(duration: number, subdivisions: number) {
    let writable = isWritable(duration, subdivisions);
    if (!writable) {
        writable = isWritable((duration / 3) * 2, subdivisions);
    }
    return writable;
}