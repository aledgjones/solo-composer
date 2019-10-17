import React, { useRef, useEffect } from 'react';

interface Props {
    insert: any;
    className: string;
}

export function InsertPoint(props: Props) {

    const { insert, className } = props;

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

    return <div className={className} ref={container} />;
}