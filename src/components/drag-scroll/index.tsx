import React, { FC, useRef, CSSProperties, useState, useCallback } from 'react';

import { merge } from 'solo-ui';
import { useDragHandler } from '../drag-handler';

import './styles.css';

interface Props {
    id?: string;
    className?: string;
    style?: CSSProperties;

    x?: boolean;
    y?: boolean;
    ignore?: string;
    ignoreX?: string;
    ignoreY?: string;
}

export const DragScroll: FC<Props> = ({ id, className, style, x, y, ignore, ignoreX, ignoreY, children }) => {

    const container = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState(false);

    const allow = useCallback((target: HTMLElement, ignore?: string) => {
        if (ignore) {
            const nodes = document.getElementsByClassName(ignore);
            for (const node of nodes) {
                if (node === target || node.contains(target)) {
                    return false;
                }
            }
            return true;
        } else {
            return true;
        }
    }, []);

    const onDrag = useDragHandler<{ allowX: boolean, allowY: boolean, x: number, y: number, scrollLeft: number, scrollTop: number }>({
        onDown: e => {
            if (container.current) {

                if (!allow(e.target as HTMLElement, ignore)) {
                    return false;
                };

                const allowX = allow(e.target as HTMLElement, ignoreX);
                const allowY = allow(e.target as HTMLElement, ignoreY);

                setDragging(true);

                return { allowX, allowY, x: e.screenX, y: e.screenY, scrollLeft: container.current.scrollLeft, scrollTop: container.current.scrollTop };
            } else {
                return false;
            }
        },
        onMove: (e, init) => {
            if (container.current) {
                if (x && init.allowX) {
                    container.current.scrollLeft = init.scrollLeft - (e.screenX - init.x);
                }
                if (y && init.allowY) {
                    container.current.scrollTop = init.scrollTop - (e.screenY - init.y);
                }
            }
        },
        onEnd: (e, init) => {
            setDragging(false);
        }
    }, [container, x, y, allow, ignore, ignoreX, ignoreY]);

    return <div onPointerDown={onDrag} id={id} className={merge('ui-drag-scroll', { 'ui-drag-scroll--dragging': dragging }, className)} style={style} ref={container} >
        {children}
    </div>
}