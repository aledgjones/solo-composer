import { useMemo } from "react";

import { Instrument, InstrumentCounts } from "../instrument";
import { measureText } from "./measure-text";
import { EngravingConfig } from "../engraving";

export function useNames(instruments: Instrument[], counts: InstrumentCounts, config: EngravingConfig, ctx?: CanvasRenderingContext2D) {
    return useMemo(() => {

        const names = instruments.reduce((output: { [key: string]: string }, instrument) => {
            const count = counts[instrument.key] ? counts[instrument.key] : '';
            output[instrument.key] = instrument.longName + count;
            return output;
        }, {});

        if (!ctx) return { names, max: 0 };

        const widths = instruments.map(instrument => measureText(names[instrument.key], `${config.staveInstrumentNameSize}px ${config.staveInstrumentNameFont}`, ctx));
        const max = Math.max(...widths);

        return { names, max };

    }, [ctx, instruments, counts, config]);
}