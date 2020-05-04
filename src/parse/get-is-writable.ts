import { NotationBaseDuration } from "./notation-track";

function isWritable(duration: number, subdivisions: number) {
    switch (duration / subdivisions) {
        case NotationBaseDuration.semiquaver:
        case NotationBaseDuration.quaver:
        case NotationBaseDuration.crotchet:
        case NotationBaseDuration.minim:
        case NotationBaseDuration.semibreve:
        case NotationBaseDuration.breve:
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
