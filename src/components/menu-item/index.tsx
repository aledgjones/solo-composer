import React, { FC } from "react";
import { merge, useForeground } from "solo-ui";

import "./styles.css";

interface Props {
    selected?: boolean;
    color: string;
    onClick?: () => void;
}

export const MenuItem: FC<Props> = ({ selected, color, onClick, children }) => {

    const fg = useForeground(color);

    return (
        <div
            className={merge("menu-item", { "menu-item--clickable": !!onClick })}
            style={{ backgroundColor: selected ? color : undefined, color: selected ? fg : undefined }}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
