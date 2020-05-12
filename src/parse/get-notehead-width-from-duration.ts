import { NotationBaseDuration } from "./notation-track";

export function getNoteheadWidthFromDuration(baseLength?: NotationBaseDuration): number {
    switch (baseLength) {
        case NotationBaseDuration.semiquaver:
        case NotationBaseDuration.quaver:
        case NotationBaseDuration.crotchet:
        case NotationBaseDuration.minim:
            return 1.13;
        case NotationBaseDuration.semibreve:
            return 1.6;
        default:
            return 0;
    }
}
