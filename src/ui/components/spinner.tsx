import React, { CSSProperties, FC, useMemo } from 'react';
import Big from 'big.js';
import { merge } from '../utils/merge';

import './spinner.css';

interface Props {
    id?: string;
    className?: string;
    style?: CSSProperties;

    size: number;
    color: string;
    max?: number;
    value?: number;
}

export const Spinner: FC<Props> = ({ id, className, style, size, color, max, value }) => {

    const [dashoffset, dasharray] = useMemo(() => {
        if (max !== undefined && value !== undefined && max > 0) {
            const c = new Big(125.66); // circumference @ r=20;
            const _value = new Big(value).div(max).times(c);
            return [c.minus(_value).toFixed(2), c.toFixed(2)];
        } else {
            return [undefined, undefined];
        }
    }, [value, max]);

    const animate = max === undefined && value === undefined;

    return <svg
        id={id}
        className={merge(
            'ui-spinner',
            { 'ui-spinner--animate': animate },
            className
        )}
        style={{
            height: size,
            width: size,
            ...style
        }}
        viewBox="25 25 50 50"
    >
        {!animate && <circle
            className="ui-spinner__circle"
            cx="50"
            cy="50"
            r="20"
            stroke="rgb(175, 175, 175)"
        />}
        <circle
            className="ui-spinner__circle"
            cx="50"
            cy="50"
            r="20"
            stroke={color}
            strokeDasharray={dasharray}
            strokeDashoffset={dashoffset}
        />
    </svg>;
}