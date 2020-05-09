import React, { FC } from "react";
import { merge } from "solo-ui";
import { ThemeDef } from "../../services/theme";

import "./styles.css";

interface Props {
    selected?: boolean;
    highlight: ThemeDef;
    onClick?: () => void;
}

export const MenuItem: FC<Props> = ({ selected, highlight, onClick, children }) => {
    return (
        <div
            className={merge("menu-item", { "menu-item--clickable": !!onClick })}
            style={{ backgroundColor: selected ? highlight.bg : undefined, color: selected ? highlight.fg : undefined }}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
