import { isObject, isString } from 'lodash';

export function merge(...args: Array<string | { [prop: string]: boolean | undefined } | undefined>) {

    const out = args.reduce((arr: string[], arg = '') => {

        if (isString(arg)) {
            const split = arg.split(' ');
            const clean = split.filter(val => val !== '');
            return arr.concat(clean);
        }

        if (isObject(arg)) {
            const keys = Object.keys(arg);
            const clean = keys.filter(key => {
                return arg[key];
            });
            return arr.concat(clean);
        }

        return arr;

    }, []);

    return out.join(' ');

}