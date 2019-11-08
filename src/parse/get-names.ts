import { Instrument, InstrumentCounts } from "../services/instrument";
import { EngravingConfig } from "../services/engraving";
import { measureText } from "./measure-text";

export enum NameType {
    long = 1,
    short
}

export type Names = {
    [key: string]: string;
}

export function getNames(instruments: Instrument[], counts: InstrumentCounts, type: NameType): Names {
    return instruments.reduce((output: { [key: string]: string }, instrument) => {
        const count = counts[instrument.key] ? counts[instrument.key] : '';
        const name = type === NameType.long ? instrument.longName : instrument.shortName;
        output[instrument.key] = name + count;
        return output;
    }, {});
}

export function getNamesWidth(names: Names, config: EngravingConfig, ) {
    const styles = { fontFamily: config.staveInstrumentNameFont, fontSize: config.staveInstrumentNameSize };
    const keys = Object.keys(names);
    const boxes = keys.map(key => measureText(styles, names[key]));
    return Math.max(...boxes);
}