import { useMemo } from "react";

import { Instrument, InstrumentCounts } from "../instrument";
import { EngravingConfig } from "../engraving";
import { Renderer } from "./renderer";

export enum NameType {
    long = 1,
    short
}

export function useNames(renderer: Renderer, instruments: Instrument[], counts: InstrumentCounts, config: EngravingConfig, type: NameType) {
    return useMemo(() => {

        const names = instruments.reduce((output: { [key: string]: string }, instrument) => {
            const count = counts[instrument.key] ? counts[instrument.key] : '';
            const name = type === NameType.long ? instrument.longName : instrument.shortName;
            output[instrument.key] = name + count;
            return output;
        }, {});

        const styles = { fontFamily: config.staveInstrumentNameFont, fontSize: config.staveInstrumentNameSize };
        const widths = instruments.map(instrument => renderer.measureText(styles, names[instrument.key]));
        const max = Math.max(...widths);

        return { names, max };

    }, [renderer, instruments, counts, config]);
}