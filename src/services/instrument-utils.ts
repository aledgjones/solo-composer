import { toRoman } from 'roman-numerals';
import { PlayerState, PlayerKey } from "./player";
import { Instruments, InstrumentKey, Instrument } from "./instrument";
import { ConfigState } from "./config";
import { Flow } from './flow';

export enum InstrumentAutoCountStyle {
    arabic = 1,
    roman
}
type InstrumentCountsTotals = { [name: string]: InstrumentKey[] };
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
            // consider solo / ensemble players as different by appending type
            const name = instrument.longName + ':' + player.type;
            if (!output[name]) {
                output[name] = [];
            }
            output[name].push(instrument.key);
        });
        return output;
    }, {});

    const names = Object.keys(counts);
    return names.reduce((out: InstrumentCounts, name: string) => {
        counts[name].forEach((instrumentKey, i, _names) => {
            if (_names.length > 1) {
                if (config.autoCountStyle === InstrumentAutoCountStyle.arabic) {
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
            player.instruments.forEach(instrumentKey => {
                output.push(instruments[instrumentKey]);
            });
        }
        return output;
    }, []);
}

export function instrumentFamily(instrument?: Instrument) {
    return instrument ? instrument.id.split('.')[0] : '';
}