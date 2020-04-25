export enum SelectionType {
    player = 1,
    flow,
    layout
}

export type Selection = {
    key: string;
    type: SelectionType;
} | null;
