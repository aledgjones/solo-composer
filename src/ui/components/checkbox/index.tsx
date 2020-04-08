import React, { FC, useCallback, CSSProperties } from 'react';
import { mdiCheck } from '@mdi/js';

import { merge } from '../../utils/merge';
import { useForeground } from '../../utils/foreground';
import { Icon } from '../icon';

import './styles.css';

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

    const onCheckboxChange = useCallback(() => onChange(!value), [value, onChange]);
    const fg = useForeground(color);

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
        onClick={onCheckboxChange}
    >
        <div
            className="ui-checkbox__inner"
            style={{
                marginRight: children ? 20 : 0,
                borderColor: value ? color : undefined,
                backgroundColor: value ? color : undefined
            }}>
            {value && <Icon size={16} color={fg} className="ui-checkbox__icon" path={mdiCheck} />}
        </div>
        {children && <div className="ui-checkbox__label">{children}</div>}
    </div>;
}