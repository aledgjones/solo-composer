import React, { FC, CSSProperties } from 'react';

import { MenuBar } from '../menu-bar';

import './styles.css';

interface Props {
    id?: string;
    className?: string;
    style?: CSSProperties;
}

export const ShellMenuBar: FC<Props> = ({ id, className, style, children }) => {
    return <MenuBar className="shell-menu-bar">
        {children}
    </MenuBar>;
}