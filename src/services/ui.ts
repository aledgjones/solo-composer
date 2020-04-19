import { Store } from "pullstate";
import { State } from "./state";

export enum Tool {
    select = 1,
    pencil,
    eraser
}

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
    tool: {
        [view: string]: Tool;
    }
}

export const uiEmptyState = (): UiState => {
    return {
        tab: TabState.setup,
        expanded: {
            [TabState.setup]: {},
            [TabState.play]: {}
        },
        tool: {
            [TabState.play]: Tool.select
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
        },
        tool: {
            play: {
                set: (tool: Tool) => {
                    store.update(s => {
                        s.ui.tool[TabState.play] = tool;
                    });
                }
            }
        }
    }
}