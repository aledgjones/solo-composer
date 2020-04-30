import React, { FC, CSSProperties } from 'react';
import { merge } from 'solo-ui';
import './styles.css';

interface Props {
    id?: string;
    className?: string;
    style?: CSSProperties;
}

export const List: FC<Props> = ({ id, className, style, children }) => {
    return <div className={merge("ui-list", className)}>{children}</div>
}