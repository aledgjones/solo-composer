import { Notation } from "./notation-track";

export function getIsRest(entry: Notation) {
    return entry.tones.length === 0;
}
