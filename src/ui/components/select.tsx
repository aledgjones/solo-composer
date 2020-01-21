import React, { useState, useMemo, CSSProperties, FC, useEffect, useRef } from 'react';
import { mdiChevronDown, mdiClose } from '@mdi/js';

import { Card } from './card';
import { Icon } from './icon';
import { merge } from '../utils/merge';

import './select.css';

interface Props {
    id?: string;
    className?: string;
    style?: CSSProperties;

    dark?: boolean;

    value: any;
    label?: string;
    color: string;
    margin?: boolean;
    required?: boolean;
    disabled?: boolean;

    onChange: (value: any) => void;
}

export const Select: FC<Props> = ({ id, className, style, dark, value, label, children, margin, onChange, color, required, disabled }) => {

    const [open, setOpen] = useState<boolean>(false);
    const element = useRef<HTMLDivElement>(null);

    const display = useMemo(() => {

        let _display = '';
        React.Children.forEach(children, (child: any) => {
            if (child.props.value === value) {
                _display = child.props.displayAs;
            }
        });
        return _display;

    }, [value, children]);

    // auto close
    useEffect(() => {
        const cb = (e: any) => {
            if (!element.current || !element.current.contains(e.target)) {
                setOpen(false);
            } else {
                setOpen(o => !o);
            }
        }
        document.addEventListener('click', cb);
        return () => document.removeEventListener('click', cb);
    }, [element]);

    const hasValue = value !== undefined || value !== null || value !== '';

    return <div
        id={id}
        className={merge('ui-select', { 'ui-select--margin': margin, 'ui-select--dark': dark, 'ui-select--disabled': disabled }, className)}
        style={style}
        ref={element}
    >

        {label && <p style={{ color: open ? color : undefined }} className="ui-input__label">{label}</p>}

        <div style={{ borderColor: open ? color : undefined }} className="ui-select__input">
            {hasValue && <p className="ui-select__display">{display}</p>}
            {(hasValue && !required) && <Icon size={24} color="#777777" path={mdiClose} />}
            {(!hasValue || required) && <Icon style={{ transform: open ? 'rotateZ(180deg)' : undefined }} size={24} color="#777777" path={mdiChevronDown} />}
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

    </div>;
}