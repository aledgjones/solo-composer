import { useMemo } from "react";

import { Instrument, InstrumentCounts } from "../instrument";
import { measureText } from "./measure-text";
import { EngravingConfig } from "../engraving";

export enum NameType {
    long = 1,
    short
}

export function useNames(instruments: Instrument[], counts: InstrumentCounts, config: EngravingConfig, type: NameType, ctx?: CanvasRenderingContext2D) {
    return useMemo(() => {

        const names = instruments.reduce((output: { [key: string]: string }, instrument) => {
            const count = counts[instrument.key] ? counts[instrument.key] : '';
            const name = type === NameType.long ? instrument.longName : instrument.shortName;
            output[instrument.key] = name + count;
            return output;
        }, {});

        if (!ctx) return { names, max: 0 };

        const widths = instruments.map(instrument => measureText(names[instrument.key], `${config.staveInstrumentNameSize}px ${config.staveInstrumentNameFont}`, ctx));
        const max = Math.max(...widths);

        return { names, max };

    }, [ctx, instruments, counts, config]);
}