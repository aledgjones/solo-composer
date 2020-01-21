import React, { FC, useMemo } from 'react';
import Color from 'color';
import { merge } from '../ui/utils/merge';

interface Props { className?: string };

export const DialogHeader: FC<Props> = ({ className, children }) => {

    const bg = 'rgb(200,200,200)';

    const fg = useMemo(() => {
        return Color(bg).isDark() ? '#ffffff' : '#000000';
    }, [bg]);

    return <div className={merge("generic-settings__header", className)} style={{ backgroundColor: bg, color: fg }}>{children}</div>
}