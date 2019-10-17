import Big from 'big.js';

export function sum(...args: number[]): number {
    console.log(args);
    const total = args.reduce((output: Big, arg) => {
        return output.plus(arg);
    }, new Big(0));
    return parseFloat(total.toFixed(2));
}