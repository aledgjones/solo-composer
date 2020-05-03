import React, { useRef, useEffect, useContext, FC, DetailedHTMLProps, HTMLAttributes, MutableRefObject, useState } from 'react';
import { SortableContext } from '../sortable-container';
import { merge, useDragHandler } from 'solo-ui';

interface Props {
    handle?: MutableRefObject<HTMLDivElement | null>;
}

export const SortableItem: FC<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & Props> = ({ className, style, handle, onPointerDown, children, ...props }) => {

    const { config, setItems } = useContext(SortableContext);
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    const ref = useRef<HTMLDivElement>(null);

    // register the dom element ref with the container.
    useEffect(() => {
        setItems(s => [...s, ref]);
        return () => {
            setItems(s => s.filter(r => r !== ref));
        }
    }, [ref, setItems]);

    const onDown = useDragHandler<{ x: number, y: number }>({
        onDown: e => {
            if (onPointerDown) {
                onPointerDown(e as any);
            }

            // cancel any pointerdown events that are not inside the handle
            if (handle && handle.current) {
                const target = e.target as HTMLDivElement;
                if (handle.current !== e.target && !handle.current.contains(target)) {
                    return false;
                }
            }

            setDragging(true);

            return {
                x: e.screenX,
                y: e.screenY
            }

        },
        onMove: (e, init) => {
            setOffset({
                x: config.x ? e.screenX - init.x : 0,
                y: config.y ? e.screenY - init.y : 0
            })

        },
        onEnd: (e, init) => {
            setDragging(false);
            setOffset({ x: 0, y: 0 });
        }
    }, [config, handle, onPointerDown]);

    return <div ref={ref} style={{ zIndex: dragging ? 1000000 : undefined, transform: `translate(${offset.x}px,${offset.y}px)`, ...style }} onPointerDown={onDown} className={merge('ui-sortable-item', { 'ui-sortable-item--dragging': dragging }, className)} {...props} >
        {children}
    </div>;
}