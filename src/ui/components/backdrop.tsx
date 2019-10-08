import * as React from 'react';

import { merge } from '../utils/merge';

import './backdrop.css';

interface Props {
    id?: string;
    className?: string;
    visible: boolean;
    disabled?: boolean;
    transparent?: boolean;
    onClick?: () => void;
}

export const Backdrop: React.FC<Props> = ({ id, className, visible, children, disabled, transparent, onClick }) => {
    return <div
        id={id}
        className={merge(
            'ui-backdrop',
            className, {
            'ui-backdrop--visible': visible,
            'ui-backdrop--disabled': disabled,
            'ui-backdrop--transparent': transparent
        })}
        onClick={onClick}
    >
        {children}
    </div>
}