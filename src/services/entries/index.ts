export type EntryKey = string;

export interface Metrics {
    width: number;
}

export interface EntryDef {
    _type: string;
}

export interface Entry<T> {
    key: EntryKey;
    measure: () => Metrics;
    def: () => T;
}