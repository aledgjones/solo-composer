import React, { FC } from "react";
import { merge } from "solo-ui";

import { THEME } from "../../const";

import "./styles.css";

interface Props {
    selected?: boolean;
    onClick?: () => void;
}

export const MenuItem: FC<Props> = ({ selected, onClick, children }) => {
    const { backgroundColor, color } = selected ? THEME.primary[500] : { backgroundColor: undefined, color: undefined };

    return (
        <div
            className={merge("menu-item", { "menu-item--clickable": !!onClick })}
            style={{ backgroundColor, color }}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
