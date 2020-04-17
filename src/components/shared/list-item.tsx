import React, { FC } from 'react';

import { THEME } from '../../const';
import { useForeground } from 'solo-ui';

import './list-item.css';

interface Props {
    selected: boolean;
    onClick: () => void;
}

export const ListItem: FC<Props> = ({ selected, onClick, children }) => {

    const bg = selected ? THEME.primary[500] : undefined;
    const fg = useForeground(bg || '#ffffff');

    return <div className="list-item" style={{ backgroundColor: bg, color: selected ? fg : undefined }} onClick={onClick}>
        {children}
    </div>;
}