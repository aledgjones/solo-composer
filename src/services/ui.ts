import { Store } from "pullstate";
import { State } from "./state";

export enum TabState {
    setup = 'setup',
    write = 'write',
    engrave = 'engrave',
    play = 'play',
    print = 'print'
}

export interface UiState {
    tab: TabState;
    expanded: {
        [view: string]: { [key: string]: boolean };
    };
}

export const uiEmptyState = (): UiState => {
    return {
        tab: TabState.setup,
        expanded: {
            [TabState.setup]: {},
            [TabState.play]: {}
        }
    }
}

export const uiActions = (store: Store<State>) => {

    function toggleExpanded(key: string, view: TabState) {
        store.update(s => {
            if (s.ui.expanded[view][key]) {
                delete s.ui.expanded[view][key];
            } else {
                s.ui.expanded[view][key] = true;
            }
        });
    }

    return {
        tab: {
            set: (tab: TabState) => {
                store.update(s => {
                    s.ui.tab = tab;
                });
            }
        },
        expanded: {
            setup: { toggle: (key: string) => toggleExpanded(key, TabState.setup) },
            play: { toggle: (key: string) => toggleExpanded(key, TabState.play) }
        }
    }
}