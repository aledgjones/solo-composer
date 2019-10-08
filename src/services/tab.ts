import { Dispatch } from "react";

export const TAB_SET = '@tab/set';

export interface TabActions {
    set: (tab: TabState) => Dispatch<any>;
}

export enum TabState {
    setup = 1,
    write,
    engrave,
    play,
    print
}

export const tabEmptyState = (): TabState => {
    return TabState.setup;
}

export const tabReducer = (state: TabState, action: any) => {
    switch (action.type) {
        case TAB_SET:
            return action.payload;
        default:
            return state;
    }
}

export const tabActions = (dispatch: any) => {
    return {
        set: (tab: TabState) => dispatch({ type: TAB_SET, payload: tab })
    }
}