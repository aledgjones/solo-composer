import React, { useRef, useEffect, CSSProperties } from 'react';

interface Props {
    insert: HTMLElement;
    className?: string;
    style?: CSSProperties;
}

export function InsertPoint(props: Props) {

    const { insert, className, style } = props;

    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const _container = container.current;
        if (container.current && insert) {
            container.current.appendChild(insert);
        }
        return () => {
            if (_container) {
                _container.innerHTML = '';
            }
        }
    }, [insert]);

    return <div style={style} className={className} ref={container} />;
}