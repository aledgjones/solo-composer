import { NotationBaseDuration } from "./notation-track";

export function glyphFromDuration(baseLength?: NotationBaseDuration) {
    switch (baseLength) {
        case NotationBaseDuration.semiquaver:
        case NotationBaseDuration.quaver:
        case NotationBaseDuration.crotchet:
            return "\u{E0A4}";
        case NotationBaseDuration.minim:
            return "\u{E0A3}";
        case NotationBaseDuration.semibreve:
            return "\u{E0A2}";
        default:
            return undefined;
    }
}
