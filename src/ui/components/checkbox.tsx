import React, { useCallback, CSSProperties, FC, useMemo, MouseEvent } from 'react';
import Color from 'color';
import { mdiCheck } from '@mdi/js';

import { Icon } from './icon';
import { merge } from '../utils/merge';

import './checkbox.css';

interface Props {
    id?: string;
    className?: string;
    style?: CSSProperties;

    value: boolean;
    color: string;
    margin?: boolean;
    disabled?: boolean;

    onChange: (value: boolean) => void;
}

export const Checkbox: FC<Props> = ({ id, className, style, children, value, color, onChange, disabled, margin }) => {

    const _onChange = useCallback((e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onChange(!value);
    }, [value, onChange]);
    
    const iconColor = useMemo(() => Color(color).isDark() ? '#ffffff' : '#000000', [color]);

    return <div
        id={id}
        className={merge(
            'ui-checkbox',
            {
                'ui-checkbox--active': value,
                'ui-checkbox--margin': margin,
                'ui-checkbox--disabled': disabled
            },
            className
        )}
        style={style}
        onClick={_onChange}
    >
        <div
            className="ui-checkbox__inner"
            style={{
                marginRight: children ? 20 : 0,
                borderColor: value ? color : undefined,
                backgroundColor: value ? color : undefined
            }}>
            {value && <Icon size={16} color={iconColor} className="ui-checkbox__icon" path={mdiCheck} />}
        </div>
        {children && <div className="ui-checkbox__label">{children}</div>}
    </div>;
}