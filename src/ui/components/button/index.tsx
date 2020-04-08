import React, { MouseEvent, CSSProperties, FC, useMemo } from 'react';

import { merge } from '../../utils/merge';
import { Spinner } from '../spinner';
import { useForeground } from '../../utils/foreground';

import './styles.css';

interface Props {
    id?: string;
    className?: string;
    style?: CSSProperties;
    color: string;

    compact?: boolean;
    outline?: boolean;
    disabled?: boolean;
    working?: boolean;

    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const Button: FC<Props> = ({ id, className, style, children, compact, outline, color, disabled, working, onClick }) => {

    const bg = useMemo(() => {
        if (outline) {
            return 'transparent';
        } else {
            return color;
        }
    }, [color, outline]);

    const fg = useForeground(bg);

    return <button
        id={id}
        className={merge('ui-button', { 'ui-button--compact': compact, 'ui-button--disabled': disabled || working }, className)}
        style={{ color: outline ? color : fg, backgroundColor: bg, border: `1px solid ${outline ? color : bg}`, ...style }}
        onClick={onClick}
    >
        {working && <Spinner className="ui-spinner--button" size={16} color="rgb(84,84,84)" />}
        {children}
    </button>;
}