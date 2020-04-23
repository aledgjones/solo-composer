import React, { FC } from 'react';

import { THEME } from '../../../const';
import { useForeground, merge } from 'solo-ui';

import './styles.css';

interface Props {
    selected?: boolean;
    onClick?: () => void;
}

export const MenuItem: FC<Props> = ({ selected, onClick, children }) => {

    const bg = selected ? THEME.primary[500] : undefined;
    const fg = useForeground(bg || '#ffffff');

    return <div className={merge("menu-item", {'menu-item--clickable': !!onClick})} style={{ backgroundColor: bg, color: selected ? fg : undefined }} onClick={onClick}>
        {children}
    </div>;
}