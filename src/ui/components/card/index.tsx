import React, { FC, CSSProperties } from 'react';

import { merge } from '../../utils/merge';

import './styles.css';

interface Props {
    id?: string;
    className?: string;
    style?: CSSProperties;

    margin?: boolean;
    animate?: boolean;
}

export const Card: FC<Props> = ({ id, className, style, children, margin, animate }) => {
    return <div
        id={id}
        className={merge('ui-card', { 'ui-card--margin': margin, 'ui-card--animate': animate }, className)}
        style={style}
    >
        {children}
    </div>;
}