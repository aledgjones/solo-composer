import React, { FC, CSSProperties, MutableRefObject, useState, SetStateAction, Dispatch } from 'react';
import { merge } from 'solo-ui';

interface Config {
    x?: boolean;
    y?: boolean;
}

type Items = MutableRefObject<HTMLDivElement | null>[];
type ItemsUpdater = Dispatch<SetStateAction<MutableRefObject<HTMLDivElement | null>[]>>;

interface Props extends Config {
    id?: string;
    className?: string;
    style?: CSSProperties;
}

export const SortableContext = React.createContext<{ config: Config, items: Items, setItems: ItemsUpdater }>({
    config: { x: false, y: false },
    items: [],
    setItems: s => s
});

export const SortableContainer: FC<Props> = ({ id, className, style, x, y, children }) => {

    const [items, setItems] = useState<MutableRefObject<HTMLDivElement | null>[]>([]);

    return <SortableContext.Provider value={{ config: { x, y }, items, setItems }}>
        <div id={id} className={merge('ui-sortable-container', className)} style={style}>{children}</div>
    </SortableContext.Provider>;
}