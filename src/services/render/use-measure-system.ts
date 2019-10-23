import Big from 'big.js';
import { Instrument } from "../instrument";
import { Config } from "../config";
import { useMemo } from 'react';

type YPositions = { [key: string]: number };
type YHeights = { [key: string]: number };

export interface SystemMetrics {
    instrumentYPositions: YPositions;
    instrumentHeights: YHeights;
    staveYPositions: YPositions,
    systemHeight: number;
}

export function useMeasureSystem(instruments: Instrument[], config: Config): SystemMetrics {
    return useMemo(() => {
        
        const instrumentLen = instruments.length;

        const metrics = instruments.reduce((output: SystemMetrics, instrument, i) => {

            const isLastInstrument = i === instrumentLen - 1;
            const instrumentTop = new Big(output.systemHeight); // this is cumulative as we loop

            const staveLen = instrument.staves.length;
            instrument.staves.forEach((staveKey, ii) => {

                const isLastStave = ii === staveLen - 1;

                const start = new Big(output.systemHeight);
                let height = new Big(config.writeSpace).times(8);

                if (!isLastStave) {
                    height = height.plus(config.writeStaveSpacing);
                }

                if (isLastStave) {
                    output.instrumentHeights[instrument.key] = parseFloat(new Big(start.plus(height)).minus(instrumentTop).toFixed(0));
                }

                if (isLastStave && !isLastInstrument) {
                    height = height.plus(config.writeInstrumentSpacing);
                }

                output.staveYPositions[staveKey] = parseFloat(start.toFixed(0));
                output.systemHeight = parseFloat(start.plus(height).toFixed(0));

            });

            output.instrumentYPositions[instrument.key] = parseFloat(instrumentTop.toFixed(0));
            return output;

        }, { instrumentYPositions: {}, instrumentHeights: {}, staveYPositions: {}, systemHeight: 0 });

        return metrics;

    }, [instruments, config]);
}