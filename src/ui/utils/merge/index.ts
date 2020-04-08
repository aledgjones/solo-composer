import { isObject, isString } from 'lodash';

export function merge(...args: Array<string | { [prop: string]: boolean | undefined } | undefined>) {

    const out = args.reduce((arr: string[], arg = '') => {

        // multiple classes
        if (isString(arg)) {
            const clean = arg.split(' ').filter(val => val !== '');
            return [...arr, ...clean];
        }

        // toggle classes => only append if evaluates to true
        if (isObject(arg)) {
            const keys = Object.keys(arg);
            const clean = keys.filter(key => {
                return arg[key];
            });
            return [...arr, ...clean];
        }

        return arr;

    }, []);

    return out.join(' ');

}