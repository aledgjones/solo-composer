import React, { MouseEvent, useCallback, FC, CSSProperties, useMemo } from 'react';
import Color from 'color';
import { merge } from '../utils/merge';
import './icon.css';

interface Props {
    id?: string;
    className?: string;
    style?: CSSProperties;

    path: string;
    size: number;
    color: string;
    disabled?: boolean;

    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export const Icon: FC<Props> = ({ id, className, style, path, size, color, disabled, onClick }) => {
    const _onClick = useCallback((e) => onClick && onClick(e), [onClick]);
    const bg = useMemo(() => Color(color).alpha(.1).string(), [color]);

    return <div
        id={id}
        className={merge('ui-icon', { 'ui-icon--disabled': disabled, 'ui-icon--hover': !!onClick }, className)}
        style={{ width: size, height: size, ...style }}
        onClick={_onClick}
    >
        <div className="ui-icon__touch-target" />
        <svg className="ui-icon__svg" viewBox="0 0 24 24" style={{ width: size, height: size }}>
            <path d={path} style={{ fill: color }} />
        </svg>
        <div className="ui-icon__blob" style={{ backgroundColor: bg }} />
    </div >
}