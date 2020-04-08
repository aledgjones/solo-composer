import React, { FC, CSSProperties } from "react";
import './styles.css';
import { merge } from "../../utils/merge";

interface Props {
    id?: string;
    className?: string;
    style?: CSSProperties;
}

export const Subheader: FC<Props> = ({ id, className, style, children }) => {
    return <p id={id} className={merge("ui-subheader", className)} style={style}>{children}</p>;
};