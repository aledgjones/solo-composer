import React, { useCallback, CSSProperties, FC, ChangeEvent, useState, useEffect } from 'react';
import { mdiChevronUp, mdiChevronDown } from '@mdi/js';
import { merge } from '../utils/merge';
import Big from 'big.js';

import { Icon } from './icon';

import './input-base.css';
import './input-number.css';

interface Props {
    id?: string;
    className?: string;
    style?: CSSProperties;
    color: string;
    errorColor: string;

    value: number;
    precision: number;
    step: number;
    label?: string;
    units?: string;
    disabled?: boolean;

    onChange: (value: number) => void;
}

export const InputNumber: FC<Props> = ({ id, className, style, value, precision, step, units, label, color, errorColor, disabled, onChange }) => {

    const [error, setError] = useState<boolean>(false);
    const [display, setDisplay] = useState<string>(value.toFixed(precision));
    const [focus, setFocus] = useState<boolean>(false);

    useEffect(() => setDisplay(value.toFixed(precision)), [value, precision]);

    const _onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setDisplay(e.target.value);
        try {
            new Big(e.target.value).toFixed(precision); // big has stricter parsing
            setError(false);
        } catch (e) {
            setError(true);
        }
    }, [precision]);

    const onBlur = useCallback(() => {

        const val = new Big(error ? value : display).toFixed(precision);
        const parsed = parseFloat(val);
        setDisplay(val);
        onChange(parsed);

        setFocus(false);
        setError(false);

    }, [display, value, error, precision, onChange]);

    const onIncrease = useCallback(() => {

        const val = new Big(error ? value : display).plus(step).toFixed(precision);
        const parsed = parseFloat(val);
        setDisplay(val);
        onChange(parsed);

    }, [step, value, display, error, precision, onChange]);

    const onDecrease = useCallback(() => {

        const val = new Big(error ? value : display).minus(step).toFixed(precision);
        const parsed = parseFloat(val);
        setDisplay(val);
        onChange(parsed);

    }, [step, value, display, error, precision, onChange]);

    const border = () => {
        if (error) {
            return `1px solid ${errorColor}`;
        }
        if (focus) {
            return `1px solid ${color}`;
        }
        return undefined;
    }

    return <div className="ui-input__container">
        {label && <p className="ui-input__label">{label}</p>}
        <div
            id={id}
            className={merge('ui-input', { 'ui-input--disabled': disabled }, className)}
            style={{ border: border(), ...style }}
        >
            <input
                className="ui-input__display"
                value={display}
                onChange={_onChange}
                onFocus={() => setFocus(true)}
                onBlur={onBlur}
            />
            {units && <p className="ui-input__units">{units}</p>}
            <div className="ui-input-number__controls">
                <Icon path={mdiChevronUp} size={18} color="#000000" onClick={onIncrease} />
                <Icon path={mdiChevronDown} size={18} color="#000000" onClick={onDecrease} />
            </div>
        </div>
    </div>;
}