import React, { useState, useMemo, CSSProperties, FC } from 'react';
import { mdiChevronDown, mdiClose } from '@mdi/js';

import { Card } from './card';
import { Icon } from './icon';
import { merge } from '../utils/merge';

import './select.css';

interface Props {
    id?: string;
    className?: string;
    style?: CSSProperties;

    value: any;
    label?: string;
    color: string;
    margin?: boolean;
    required?: boolean;
    disabled?: boolean;

    onChange: (value: any) => void;
}

export const Select: FC<Props> = ({ id, className, style, value, label, children, margin, onChange, color, required, disabled }) => {

    const [open, setOpen] = useState<boolean>(false);

    const display = useMemo(() => {

        let _display = '';
        React.Children.forEach(children, (child: any) => {
            if (child.props.value === value) {
                _display = child.props.displayAs;
            }
        });
        return _display;

    }, [value, children]);

    const hasValue = value !== undefined || value !== null || value !== '';

    return <div className={merge('ui-input__container', { 'ui-input__container--margin': margin }, className)}>
        
        {label && <p className="ui-input__label">{label}</p>}
        
        <div
            id={id}
            className={merge('ui-select', { 'ui-select--disabled': disabled })}
            style={style}
        >

            <div style={{ borderColor: open ? color : undefined }} className="ui-select__input" onClick={() => setOpen(!open)}>

                {hasValue && <p className="ui-select__display">{display}</p>}

                {(hasValue && !required) && <Icon size={24} color="#777777" path={mdiClose} onClick={(e) => {
                    e.stopPropagation();
                    onChange('');
                }} />}

                {(!hasValue || required) && <Icon style={{ transform: open ? 'rotateZ(180deg)' : undefined }} size={24} color="#777777" path={mdiChevronDown} onClick={(e) => {
                    e.stopPropagation();
                    setOpen(!open);
                }} />}

            </div>

            {open && <Card className="ui-select__card">
                {
                    React.Children.map(children, (child: any) => {
                        return <div className="ui-select__item" key={child.props.value} onClick={() => {
                            onChange(child.props.value);
                            setOpen(false);
                        }}>
                            {child}
                        </div>;
                    })
                }
            </Card>}

        </div>
    </div>;
}