import { Store } from "pullstate";
import { State } from "./state";
import { InstrumentKey } from "./instrument";

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
    pianoRollOffsetY: { [key: string]: number };
    tool: { [TabState.play]: Tool; };
}

export const uiEmptyState = (): UiState => {
    return {
        tab: TabState.setup,
        expanded: {},
        selection: {},
        pianoRollOffsetY: {},
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
                    window.history.pushState(tab, `Solo Composer | ${tab}`, tab);
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
                select: (key: string) => {
                    store.update(s => {
                        s.ui.selection[key] = true;
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
        pianoRollOffsetY: {
            set: (key: InstrumentKey, value: number) => {
                store.update(s => {
                    if (value >= -48 && value <= 36) {
                        s.ui.pianoRollOffsetY[key] = value;
                    }
                });
            },
            inc: (key: InstrumentKey) => {
                store.update(s => {
                    const next = (s.ui.pianoRollOffsetY[key] || 0) + 1;
                    if (next <= 36) {
                        s.ui.pianoRollOffsetY[key] = next;
                    }
                });
            },
            dec: (key: InstrumentKey) => {
                store.update(s => {
                    const next = (s.ui.pianoRollOffsetY[key] || 0) - 1;
                    if (next >= -48) {
                        s.ui.pianoRollOffsetY[key] = next;
                    }
                });
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