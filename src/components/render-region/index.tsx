import React, { FC } from "react";
import { merge, DragScroll } from "solo-ui";
import { useAppState } from "../../services/state";

import "./styles.css";
import bg from './background.png';

interface Props {
    className?: string;
}

export const RenderRegion: FC<Props> = ({ children, className }) => {
    const theme = useAppState(s => s.ui.theme.pallets);

    return (
        <DragScroll x y className={merge("render-region", className)} style={{ backgroundColor: theme.primary[400].bg, backgroundImage: `url(${bg})` }}>
            {children}
        </DragScroll>
    );
};
