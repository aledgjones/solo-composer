import React, { FC, CSSProperties } from 'react';

interface Props {
    className?: string;
    style?: CSSProperties;
    offset?: number;
}

export const Text: FC<Props> = ({ className, style, children }) => {
    const regex = /(@[^\s@]*@)/g;
    const text = children ? children.toString() : '';
    const result = text.split(regex);
    return <div className={className} style={style}>
        {result.map(str => {
            if (regex.test(str)) {
                return <span style={{ padding: '0 .05em', display: 'inline-block', lineHeight: '1em', fontSize: '1.5em', fontFamily: 'Music Text' }}>{str.slice(1, -1)}</span>;
            } else {
                return <span>{str}</span>;
            }
        })}
    </div>;
}