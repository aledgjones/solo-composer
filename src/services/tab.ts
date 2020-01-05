export const TAB_SET = '@tab/set';

export interface TabActions {
    set: (tab: TabState) => void;
}

export enum TabState {
    setup = 1,
    write,
    engrave,
    play,
    print
}

export const tabEmptyState = (): TabState => {
    return TabState.play;
}

export const tabReducer = (state: TabState, action: any) => {
    switch (action.type) {
        case TAB_SET:
            return action.payload;
        default:
            return state;
    }
}

export const tabActions = (dispatch: any): TabActions => {
    return {
        set: (tab: TabState) => dispatch({ type: TAB_SET, payload: tab })
    }
}