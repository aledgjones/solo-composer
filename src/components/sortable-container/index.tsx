import React, { FC, useState, DetailedHTMLProps, HTMLAttributes } from 'react';
import { merge } from 'solo-ui';

import { SortableContext, Item } from './context';

interface Props {
    direction: 'x' | 'y',
    onEnd: (oldIndex: number, newIndex: number) => void;
}

export const SortableContainer: FC<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & Props> = ({ direction, onEnd, className, children, ...props }) => {

    const [items, setItems] = useState<Item[]>([]);

    return <SortableContext.Provider value={{ config: { direction, onEnd }, items, setItems }}>
        <div className={merge('ui-sortable-container', className)} {...props}>{children}</div>
    </SortableContext.Provider>;
}