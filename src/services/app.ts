import { Store } from "pullstate";
import { State } from "./state";
import { ThemeState, themeEmptyState, themeActions } from "./app-theme";

export interface AppState {
    theme: ThemeState;
}

export const appEmptyState = (): AppState => {
    return {
        theme: themeEmptyState()
    };
};

export const appActions = (store: Store<State>) => {
    return {
        theme: themeActions(store)
    };
};
