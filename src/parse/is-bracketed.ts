import { Instrument } from "../services/instrument";
import { BracketingType } from "./draw-brackets";

function instrumentFamily(instrument?: Instrument) {
    return instrument ? instrument.id.split('.')[0] : '';
}

export enum BracketSpan {
    none,
    start,
    continue
}

export function isBracketed(instrument: Instrument, previousInstrument: Instrument, bracketing: BracketingType): BracketSpan {

    const instrumentType = instrumentFamily(instrument);
    const previousInstrumentType = instrumentFamily(previousInstrument);
    const isSameType = instrumentType === previousInstrumentType;

    if (bracketing === BracketingType.none) {
        return BracketSpan.none;
    }

    if (bracketing === BracketingType.smallEnsemble) {
        if (instrumentType === 'keyboards') {
            return BracketSpan.none;
        }
        if (!previousInstrument || previousInstrumentType === 'keyboards') {
            return BracketSpan.start;
        }
        return BracketSpan.continue;
    }

    if (bracketing === BracketingType.orchestral) {
        switch (instrumentType) {
            case 'strings':
            case 'woodwinds':
            case 'brass':
                if (isSameType) {
                    return BracketSpan.continue;
                } else {
                    return BracketSpan.start;
                }
            default:
                return BracketSpan.none;
        }
    }

    return BracketSpan.none;

}