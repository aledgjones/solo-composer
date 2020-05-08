import React, { FC, useMemo } from "react";

import { merge, DragScroll } from "solo-ui";

import { THEME } from "../const";

import "./render-region.css";

interface Props {
    className?: string;
}

export const RenderRegion: FC<Props> = ({ children, className }) => {
    const bg = useMemo(() => {
        const start = THEME.primary[400].backgroundColor;
        const stop = THEME.primary[700].backgroundColor;
        return `linear-gradient(${start}, ${stop})`;
    }, []);

    return (
        <DragScroll
            x
            y
            className={merge("render-region", className)}
            style={{ backgroundImage: bg }}
        >
            {children}
        </DragScroll>
    );
};
