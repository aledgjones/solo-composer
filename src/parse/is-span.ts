import { Instrument } from "../services/score-instrument";
import { BracketingType } from "./draw-brackets";
import { instrumentFamily } from "../services/score-instrument-utils";

export enum BracketSpan {
    none,
    start,
    continue
}

export function isSpan(
    instrument: Instrument,
    previousInstrument: Instrument | undefined,
    nextInstrument: Instrument | undefined,
    bracketing: BracketingType,
    bracketSingleStaves: boolean
): BracketSpan {
    const instrumentType = instrumentFamily(instrument);
    const previousInstrumentType = instrumentFamily(previousInstrument);
    const nextInstrumentType = instrumentFamily(nextInstrument);

    if (bracketing === BracketingType.none) {
        return BracketSpan.none;
    }

    if (bracketing === BracketingType.smallEnsemble) {
        if (instrumentType === "keyboards") {
            return BracketSpan.none;
        }
        if (!previousInstrument || previousInstrumentType === "keyboards") {
            return BracketSpan.start;
        }
        return BracketSpan.continue;
    }

    if (bracketing === BracketingType.orchestral) {
        switch (instrumentType) {
            case "strings":
            case "woodwinds":
            case "brass":
                if (instrumentType === previousInstrumentType) {
                    return BracketSpan.continue;
                } else if (nextInstrumentType === instrumentType || bracketSingleStaves) {
                    return BracketSpan.start;
                }
            default:
                return BracketSpan.none;
        }
    }

    return BracketSpan.none;
}
