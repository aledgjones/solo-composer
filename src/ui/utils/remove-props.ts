export function removeProps(obj: { [prop: string]: any }, keys: string[]) {
    return keys.reduce((output: { [prop: string]: any }, key) => {
        const { [key]: removed, ...others } = output;
        return others;
    }, obj);
}