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
    expanded: { [key: string]: boolean };
    selection: { [key: string]: boolean };
    tool: {
        [view: string]: Tool;
    }
}

export const uiEmptyState = (): UiState => {
    return {
        tab: TabState.setup,
        expanded: {},
        selection: {},
        tool: {
            [TabState.play]: Tool.select
        }
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
        },
        expanded: {
            toggle: (key: string) => {
                store.update(s => {
                    if (s.ui.expanded[key]) {
                        delete s.ui.expanded[key];
                    } else {
                        s.ui.expanded[key] = true;
                    }
                });
            }
        },
        selection: {
            [TabState.play]: {
                toggle: (key: string) => {
                    store.update(s => {
                        if (s.ui.selection[key] === true) {
                            delete s.ui.selection[key];
                        } else {
                            s.ui.selection[key] = true;
                        }
                    });
                },
                deselect: (key: string) => {
                    store.update(s => {
                        delete s.ui.selection[key];
                    });
                },
                clear: () => {
                    store.update(s => {
                        s.ui.selection = {};
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