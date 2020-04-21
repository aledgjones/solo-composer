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
    selection: {
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
        selection: {
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
            [TabState.setup]: { toggle: (key: string) => toggleExpanded(key, TabState.setup) },
            [TabState.play]: { toggle: (key: string) => toggleExpanded(key, TabState.play) }
        },
        selection: {
            [TabState.play]: {
                toggle: (key: string) => {
                    store.update(s => {
                        if (s.ui.selection[TabState.play][key] === true) {
                            delete s.ui.selection[TabState.play][key];
                        } else {
                            s.ui.selection[TabState.play][key] = true;
                        }
                    });
                },
                deselect: (key: string) => {
                    store.update(s => {
                        delete s.ui.selection[TabState.play][key];
                    });
                },
                clear: () => {
                    store.update(s => {
                        s.ui.selection[TabState.play] = {};
                    });
                }
            }
        },
        tool: {
            [TabState.play]: {
                set: (tool: Tool) => {
                    store.update(s => {
                        s.ui.tool[TabState.play] = tool;
                    });
                }
            }
        }
    }
}