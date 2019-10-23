import { Instrument, InstrumentCounts } from "../instrument";
import { measureText } from "./measure-text";
import { Config } from "../config";
import { useMemo } from "react";

export function useNames(instruments: Instrument[], counts: InstrumentCounts, config: Config, ctx?: CanvasRenderingContext2D) {
    return useMemo(() => {

        const names = instruments.reduce((output: { [key: string]: string }, instrument) => {
            const count = counts[instrument.key] ? ` ${counts[instrument.key]}` : '';
            output[instrument.key] = instrument.longName + count;
            return output;
        }, {});

        if (!ctx) return { names, max: 0 };

        const widths = instruments.map(instrument => measureText(names[instrument.key], `${config.writeInstrumentNameSize}px ${config.writeInstrumentNameFont}`, ctx));
        const max = Math.max(...widths);

        return { names, max };

    }, [ctx, instruments, counts, config]);
}