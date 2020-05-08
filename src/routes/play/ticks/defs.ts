export interface Tick {
    x: number;
    width: number;
    isBeat: boolean;
    isFirstBeat: boolean;
    isQuaverBeat: boolean;
    isGroupingBoundry: boolean;
}

export interface TickList {
    list: Tick[];
    width: number;
}
