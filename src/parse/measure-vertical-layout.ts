import Big from "big.js";
import { Instrument, InstrumentKey } from "../services/instrument";
import { StaveKey } from "../services/stave";
import { isSpan, BracketSpan } from "./is-span";
import { EngravingConfig } from "../services/engraving";

export interface VerticalMeasurements {
    systemHeight: number;
    instruments: {
        [instrumentKey: string]: {
            y: number;
            height: number;
        };
    };
    staves: {
        [staveKey: string]: {
            y: number;
            height: number;
        };
    };
    brackets: Array<{ start: InstrumentKey; stop: InstrumentKey }>;
    subBrackets: Array<{ start: InstrumentKey; stop: InstrumentKey }>;
    braces: Array<{ start: StaveKey; stop: StaveKey }>;
    barlines: Array<{ start: InstrumentKey; stop: InstrumentKey }>;
}

export function measureVerticalLayout(
    instruments: Instrument[],
    config: EngravingConfig
): VerticalMeasurements {
    const instrumentLen = instruments.length;

    const metrics = instruments.reduce(
        (output: VerticalMeasurements, instrument, i) => {
            if (!output.instruments[instrument.key]) {
                output.instruments[instrument.key] = { y: 0, height: 0 };
            }

            const isLastInstrument = i === instrumentLen - 1;
            const instrumentTop = output.systemHeight; // this is cumulative as we loop
            const previousInstrument = instruments[i - 1];
            const nextInstrument = instruments[i + 1];

            // BRACKETS

            const spans = isSpan(
                instrument,
                previousInstrument,
                nextInstrument,
                config.bracketing,
                config.bracketSingleStaves
            );

            switch (spans) {
                case BracketSpan.start:
                    output.brackets.push({ start: instrument.key, stop: instrument.key });
                    break;
                case BracketSpan.continue:
                    output.brackets[output.brackets.length - 1].stop = instrument.key;
                    break;
                default:
                    break;
            }

            // SUB BRACKETS

            if (
                config.subBracket &&
                previousInstrument &&
                (spans === BracketSpan.start || spans === BracketSpan.continue) &&
                instrument.id === previousInstrument.id
            ) {
                const subBracketEntry = output.subBrackets[output.subBrackets.length - 1];
                if (subBracketEntry && subBracketEntry.stop === previousInstrument.key) {
                    subBracketEntry.stop = instrument.key;
                } else {
                    output.subBrackets.push({
                        start: previousInstrument.key,
                        stop: instrument.key
                    });
                }
            }

            // BRACES

            if (instrument.staves.length > 1) {
                output.braces.push({ start: instrument.staves[0], stop: instrument.staves[1] });
            }

            // BARLINES

            switch (spans) {
                case BracketSpan.start:
                    output.barlines.push({ start: instrument.key, stop: instrument.key });
                    break;
                case BracketSpan.continue:
                    output.barlines[output.barlines.length - 1].stop = instrument.key;
                    break;
                default:
                    output.barlines.push({ start: instrument.key, stop: instrument.key });
                    break;
            }

            // STAVE / INSTRUMENT POSITIONS

            const staveLen = instrument.staves.length;
            instrument.staves.forEach((staveKey, ii) => {
                if (!output.staves[staveKey]) {
                    output.staves[staveKey] = { y: 0.0, height: 0.0 };
                }

                const isLastStave = ii === staveLen - 1;

                const start = output.systemHeight;
                let height = 4;

                // calc the height of all the instruments staves
                if (isLastStave) {
                    output.instruments[instrument.key].height = parseFloat(
                        new Big(start + height - instrumentTop).round(2, 1).toFixed(2)
                    );
                }

                if (!isLastStave) {
                    height = height + config.staveSpacing;
                }

                if (isLastStave && !isLastInstrument) {
                    height = height + config.instrumentSpacing;
                }

                output.staves[staveKey].y = parseFloat(new Big(start).round(2, 1).toString());
                output.staves[staveKey].height = 4;
                output.systemHeight = parseFloat(new Big(start + height).round(2, 1).toString());
            });

            output.instruments[instrument.key].y = parseFloat(
                new Big(instrumentTop).round(2, 1).toString()
            );
            return output;
        },
        {
            instruments: {},
            staves: {},
            brackets: [],
            subBrackets: [],
            braces: [],
            barlines: [],
            systemHeight: 0
        }
    );

    return metrics;
}
