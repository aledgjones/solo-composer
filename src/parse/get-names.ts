import { Instrument, InstrumentCounts } from "../services/instrument";
import { EngravingConfig } from "../services/engraving";
import { measureText } from "./measure-text";
import { Converter } from "./converter";
import { TextStyles } from "../render/text";

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

export function getNamesWidth(names: Names, config: EngravingConfig, converter: Converter) {
    const styles: TextStyles = { color: '#000000', font: config.staveInstrumentNameFont, size: config.staveInstrumentNameSize, align: 'left', baseline: 'middle' };
    const keys = Object.keys(names);
    const boxes = keys.map(key => measureText(styles, names[key], converter));
    return Math.max(...boxes);
}