import { toRoman } from "roman-numerals";
import { PlayerState, PlayerKey, PlayerType } from "./score-player";
import { Instruments, InstrumentKey, Instrument } from "./score-instrument";
import { ConfigState } from "./score-config";
import { Flow } from "./score-flow";

export enum InstrumentAutoCountStyle {
    arabic = 1,
    roman
}

interface InstrumentCountsTotals {
    [name: string]: {
        [PlayerType.solo]: InstrumentKey[];
        [PlayerType.section]: InstrumentKey[];
    };
}

export type InstrumentCounts = { [instrumentKey: string]: string };

/**
 * Counts duplicate instrument names
 *
 * If there is more than one of the same instrument we add an auto inc count.
 * we use the length of the count array to tell if > 1 if so index + 1 = instrument number.
 *
 * eg violin ${counts['violin'].length + 1} = Violin *1*
 */
export function getCounts(players: PlayerState, instruments: Instruments, config: ConfigState) {
    const counts = players.order.reduce((output: InstrumentCountsTotals, playerKey: PlayerKey) => {
        const player = players.byKey[playerKey];
        player.instruments.forEach((instrumentKey: InstrumentKey) => {
            const instrument = instruments[instrumentKey];
            if (!output[instrument.longName]) {
                output[instrument.longName] = { [PlayerType.solo]: [], [PlayerType.section]: [] };
            }
            output[instrument.longName][player.type].push(instrument.key);
        });
        return output;
    }, {});

    const names = Object.keys(counts);
    return names.reduce((out: InstrumentCounts, name: string) => {
        counts[name][PlayerType.solo].forEach((instrumentKey, i, _names) => {
            if (_names.length > 1) {
                if (config.autoCountStyleSolo === InstrumentAutoCountStyle.arabic) {
                    out[instrumentKey] = ` ${i + 1}`;
                } else {
                    out[instrumentKey] = ` ${toRoman(i + 1)}`;
                }
            }
        });

        counts[name][PlayerType.section].forEach((instrumentKey, i, _names) => {
            if (_names.length > 1) {
                if (config.autoCountStyleSection === InstrumentAutoCountStyle.arabic) {
                    out[instrumentKey] = ` ${i + 1}`;
                } else {
                    out[instrumentKey] = ` ${toRoman(i + 1)}`;
                }
            }
        });
        return out;
    }, {});
}

/**
 * get an array of instruments
 * optionally filter by the flow
 */
export function getInstruments(players: PlayerState, instruments: Instruments, flow?: Flow): Instrument[] {
    return players.order.reduce((output: Instrument[], playerKey) => {
        const player = players.byKey[playerKey];
        if (!flow || flow.players.includes(player.key)) {
            player.instruments.forEach((instrumentKey) => {
                output.push(instruments[instrumentKey]);
            });
        }
        return output;
    }, []);
}

export function instrumentFamily(instrument?: Instrument) {
    return instrument ? instrument.id.split(".")[0] : "";
}
