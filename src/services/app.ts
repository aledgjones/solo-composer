import { Store } from "pullstate";
import { State } from "./state";
import { ThemeState, themeEmptyState, themeActions } from "./app-theme";

export interface AppState {
    theme: ThemeState;
    audition: boolean;
}

export const appEmptyState = (): AppState => {
    return {
        theme: themeEmptyState(),
        audition: true
    };
};

export const appActions = (store: Store<State>) => {
    return {
        theme: themeActions(store),
        audition: {
            toggle: () => {
                store.update((s) => {
                    s.app.audition = !s.app.audition;
                });
            }
        }
    };
};
