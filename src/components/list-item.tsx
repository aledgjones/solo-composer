import React, { FC, useMemo } from 'react';
import Color from 'color';

import { Theme } from '../const';

import './list-item.css';

interface Props {
    selected: boolean;
    onClick: () => void;
}

export const ListItem: FC<Props> = ({ selected, onClick, children }) => {

    const bg: string = useMemo(() => selected ? Color(Theme.primary).lighten(.3).rgb().string() : '#ffffff', [selected]);
    const fg = useMemo(() => Color(bg).isDark() ? '#ffffff' : '#000000', [bg]);

    return <div className="list-item" style={{ backgroundColor: bg, color: fg }} onClick={onClick}>
        {children}
    </div>;
}