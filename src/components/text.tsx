import React, { FC, CSSProperties, useMemo } from "react";

import "./text.css";

interface Props {
    className?: string;
    style?: CSSProperties;
    offset?: number;
}

export const Text: FC<Props> = ({ className, style, children }) => {
    const result = useMemo(() => {
        const regex = /(@[^\s@]*@)/g;
        const text = children ? children.toString() : "";
        const result = text.split(regex).filter(entry => entry);
        return result.map(str => {
            const isToken = regex.test(str);
            return {
                isToken,
                text: isToken ? str.slice(1, -1) : str
            };
        });
    }, [children]);

    return (
        <div className={className} style={style}>
            {result.map((e, i) => {
                if (e.isToken) {
                    return (
                        <span key={i} className="text--token">
                            {e.text}
                        </span>
                    );
                } else {
                    return <span key={i}>{e.text}</span>;
                }
            })}
        </div>
    );
};
