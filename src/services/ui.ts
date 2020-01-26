import { Store } from "pullstate";
import { State } from "./state";

export enum TabState {
    setup = 1,
    write,
    engrave,
    play,
    print
}

export interface UiState {
    tab: TabState;
}

export const uiEmptyState = (): UiState => {
    return {
        tab: TabState.write
    }
}

export const uiActions = (store: Store<State>) => {
    return {
        tab: {
            set: (tab: TabState) => {
                store.update(s => {
                    s.ui.tab = tab;
                });
            }
        }
    }
}