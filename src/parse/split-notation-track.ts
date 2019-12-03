import { NotationTrack } from "./notation-track";
import { getNearestNotationToTick } from "./get-nearest-notation-to-tick";

/**
 * Split the notation track at split points
 * 
 * NB. You can safely pass in a split point at the begining of a note -- it will be ignored
 */
export function splitNotationTrack(track: NotationTrack, split: number): NotationTrack {


    const out = { ...track };
    const event = getNearestNotationToTick(split, track);

    // check for undefined event and only split if split index it's not already the start of an event.
    if (event && event.at !== split) {

        out[event.at] = {
            ...event.entry,
            duration: split - event.at,
            ties: event.entry.keys
        }

        out[split] = {
            ...event.entry,
            ties: event.entry.ties || [],
            duration: event.at + event.entry.duration - split
        }
        
    }

    return out;

}