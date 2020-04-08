import React, { FC, useMemo } from 'react';

import { THEME } from '../../const';

import './list-item.css';

interface Props {
    selected: boolean;
    onClick: () => void;
}

export const ListItem: FC<Props> = ({ selected, onClick, children }) => {

    const { fg, bg } = useMemo(() => selected ? THEME.primary[500] : { bg: undefined, fg: '#000000' }, [selected]);

    return <div className="list-item" style={{ backgroundColor: bg, color: fg }} onClick={onClick}>
        {children}
    </div>;
}