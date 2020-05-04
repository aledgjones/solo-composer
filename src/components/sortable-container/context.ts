import { MutableRefObject, Dispatch, SetStateAction, createContext } from "react";

export interface Item {
    key: string;
    index: number;
    active: boolean;
    sorting: boolean;
    offset: { x: number, y: number };
    ref: MutableRefObject<HTMLDivElement | null>;
}
type ItemsUpdater = Dispatch<SetStateAction<Item[]>>;

interface Context {
    config: { direction: 'x' | 'y', onEnd: (oldIndex: number, newIndex: number) => void };
    items: Item[];
    setItems: ItemsUpdater;
}

export const SortableContext = createContext<Context>({
    config: { direction: 'y', onEnd: () => { } },
    items: [],
    setItems: () => { }
});