import React, { MouseEvent, useCallback, CSSProperties, FC, useMemo } from 'react';
import Color from 'color';

import { merge } from '../utils/merge';
import { Spinner } from './spinner';

import './button.css';

interface Props {
    id?: string;
    className?: string;
    style?: CSSProperties;
    color: string;

    compact?: boolean;
    disabled?: boolean;
    working?: boolean;

    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export const Button: FC<Props> = ({ id, className, style, children, compact, color, disabled, working, onClick }) => {

    const onClickHandler = useCallback((e) => {
        onClick && onClick(e);
    }, [onClick]);

    const fg = useMemo(() => {
        return Color(color).isDark() ? 'rgb(255,255,255)' : 'rgb(0,0,0,)';
    }, [color]);

    return <button
        id={id}
        className={merge(
            'ui-button',
            {
                'ui-button--compact': compact,
                'ui-button--disabled': disabled || working
            },
            className
        )}
        style={{
            color: fg,
            backgroundColor: color,
            ...style
        }}
        onClick={onClickHandler}
    >
        {working && <Spinner className="ui-spinner--button" size={16} color={fg} />}
        {children}
    </button>;
}