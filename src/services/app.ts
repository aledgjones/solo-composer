import { Store } from "pullstate";
import { State } from "./state";
import { ThemeState, themeEmptyState, themeActions } from "./app-theme";
import { localconfig } from "./localstorage";

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
            init: async () => {
                const audition = await localconfig.getItem<boolean>("audition/v1");
                store.update((s) => {
                    s.app.audition = audition === null ? true : audition;
                });
            },
            toggle: async () => {
                const prev = store.getRawState().app.audition;
                await localconfig.setItem("audition/v1", !prev);
                store.update((s) => {
                    s.app.audition = !prev;
                });
            }
        }
    };
};
