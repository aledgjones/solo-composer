import Big from 'big.js';
import { Instrument, InstrumentKey } from "../instrument";
import { useMemo } from 'react';
import { StaveKey } from '../stave';
import { isBracketed, BracketSpan } from './is-bracketed';
import { EngravingConfig } from '../engraving';

// type YPositions = { [key: string]: number };
// type YHeights = { [key: string]: number };

export interface SystemMetrics {
    systemHeight: number;
    instruments: {
        [instrumentKey: string]: {
            y: number;
            height: number;
        }
    },
    staves: {
        [staveKey: string]: {
            y: number;
            height: number;
        }
    },
    brackets: Array<{ start: InstrumentKey, stop: InstrumentKey }>;
    subBrackets: Array<{ start: InstrumentKey, stop: InstrumentKey }>;
    braces: Array<{ start: StaveKey, stop: StaveKey }>;
    barlines: Array<{ start: InstrumentKey, stop: InstrumentKey }>;
}

export function useMeasureSystem(instruments: Instrument[], config: EngravingConfig): SystemMetrics {
    return useMemo(() => {

        const instrumentLen = instruments.length;

        const metrics = instruments.reduce((output: SystemMetrics, instrument, i) => {

            if (!output.instruments[instrument.key]) {
                output.instruments[instrument.key] = { y: 0, height: 0 };
            }

            const isLastInstrument = i === instrumentLen - 1;
            const instrumentTop = new Big(output.systemHeight); // this is cumulative as we loop
            const previousInstrument = instruments[i - 1];

            // BRACKETS / BARLINES

            const span = isBracketed(instrument, previousInstrument, config.bracketing);

            switch (span) {
                case BracketSpan.start:
                    output.brackets.push({ start: instrument.key, stop: instrument.key });
                    output.barlines.push({ start: instrument.key, stop: instrument.key });
                    break;
                case BracketSpan.continue:
                    output.brackets[output.brackets.length - 1].stop = instrument.key;
                    output.barlines[output.barlines.length - 1].stop = instrument.key;
                    break;
                default:
                    output.barlines.push({ start: instrument.key, stop: instrument.key });
                    break;
            }

            // SUB BRACKETS

            if (previousInstrument && (span === BracketSpan.start || span === BracketSpan.continue) && instrument.id === previousInstrument.id) {
                const subBracketEntry = output.subBrackets[output.subBrackets.length - 1];
                if (subBracketEntry && subBracketEntry.stop === previousInstrument.key) {
                    subBracketEntry.stop = instrument.key;
                } else {
                    output.subBrackets.push({ start: previousInstrument.key, stop: instrument.key });
                }
            }

            // BRACES

            if (instrument.staves.length > 1) {
                output.braces.push({ start: instrument.staves[0], stop: instrument.staves[1] });
            }

            // STAVE / INSTRUMENT POSITIONS

            const staveLen = instrument.staves.length;
            instrument.staves.forEach((staveKey, ii) => {

                if (!output.staves[staveKey]) {
                    output.staves[staveKey] = { y: 0, height: 0 };
                }

                const isLastStave = ii === staveLen - 1;

                const start = new Big(output.systemHeight);
                let height = new Big(config.space).times(4);

                if (!isLastStave) {
                    height = height.plus(config.staveSpacing);
                }

                if (isLastStave) {
                    output.instruments[instrument.key].height = parseFloat(new Big(start.plus(height)).minus(instrumentTop).toFixed(0));
                }

                if (isLastStave && !isLastInstrument) {
                    height = height.plus(config.instrumentSpacing);
                }

                output.staves[staveKey].y = parseFloat(start.toFixed(0));
                output.staves[staveKey].height = parseFloat(new Big(config.space).times(4).toFixed(0));
                output.systemHeight = parseFloat(start.plus(height).toFixed(0));

            });

            output.instruments[instrument.key].y = parseFloat(instrumentTop.toFixed(0));
            return output;

        }, { instruments: {}, staves: {}, brackets: [], subBrackets: [], braces: [], barlines: [], systemHeight: 0 });

        return metrics;

    }, [instruments, config]);
}