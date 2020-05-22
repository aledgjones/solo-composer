import { Instrument } from "../services/score-instrument";
import { InstrumentCounts } from "../services/score-instrument-utils";

export enum NameType {
    long = 1,
    short
}

export type Names = {
    [key: string]: string;
};

export function getNames(instruments: Instrument[], counts: InstrumentCounts, type: NameType): Names {
    return instruments.reduce((output: { [key: string]: string }, instrument) => {
        const count = counts[instrument.key] ? counts[instrument.key] : "";
        const name = type === NameType.long ? instrument.longName : instrument.shortName;
        output[instrument.key] = name + count;
        return output;
    }, {});
}
