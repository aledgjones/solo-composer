import React, { FC } from "react";
import { merge } from "solo-ui";
import { useAppState } from "../../services/state";

import "./styles.css";

interface Props {
    className?: string;
}

export const Panel: FC<Props> = ({ className, children }) => {

    const theme = useAppState(s => s.ui.theme.pallets);

    return <div className={merge("panel", className)} style={{ backgroundColor: theme.background[200].bg }}>
        {children}
    </div>;
};
