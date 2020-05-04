import React, { useRef, useEffect, useContext, FC, DetailedHTMLProps, HTMLAttributes, MutableRefObject, useMemo } from 'react';
import { merge, useDragHandler } from 'solo-ui';
import { SortableContext, Item } from '../sortable-container/context';
import shortid from 'shortid';

function getAbsoluteHeight(element: HTMLDivElement | null) {
    if (element) {
        var styles = window.getComputedStyle(element);
        var margin = parseFloat(styles['marginBottom']);
        return Math.ceil(element.offsetHeight + margin);
    } else {
        return 0;
    }
}

function getAbsoluteWidth(element: HTMLDivElement | null) {
    if (element) {
        var styles = window.getComputedStyle(element);
        var margin = parseFloat(styles['marginRight']);
        return Math.ceil(element.offsetWidth + margin);
    } else {
        return 0;
    }
}

function getInsertPointY(e: PointerEvent, items: Item[], oldIndex: number) {
    let newIndex = 0;
    items.forEach(item => {
        const box = item.ref.current?.getBoundingClientRect();
        if (box) {
            const insertCutOffPoint = box.top + (box.height / 2);
            // don't insertAt the existing index
            if (e.clientY > insertCutOffPoint) {
                if (item.index > oldIndex) {
                    if (item.index > newIndex) {
                        newIndex = item.index;
                    }
                } else if (item.index < oldIndex) {
                    if (item.index + 1 > newIndex) {
                        newIndex = item.index + 1;
                    }
                }
            }
        }
    });
    return newIndex;
}

function getInsertPointX(e: PointerEvent, items: Item[], oldIndex: number) {
    let newIndex = 0;
    items.forEach(item => {
        const box = item.ref.current?.getBoundingClientRect();
        if (box) {
            const insertCutOffPoint = box.left + (box.width / 2);
            // don't insertAt the existing index
            if (e.clientX > insertCutOffPoint) {
                if (item.index > oldIndex) {
                    if (item.index > newIndex) {
                        newIndex = item.index;
                    }
                } else if (item.index < oldIndex) {
                    if (item.index + 1 > newIndex) {
                        newIndex = item.index + 1;
                    }
                }
            }
        }
    });
    return newIndex;
}

function getOffset(item: Item, insertAt: number, index: number, offsetItemsBy: number) {
    if (item.index < index) {
        if (insertAt <= item.index) {
            return offsetItemsBy;
        }
    }

    if (item.index > index) {
        if (insertAt >= item.index) {
            return -offsetItemsBy;
        }
    }

    return 0;
}

interface Props {
    index: number;
    handle?: MutableRefObject<HTMLDivElement | null>;
}

export const SortableItem: FC<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & Props> = ({ index, className, style, handle, onPointerDown, children, ...props }) => {

    const key = useMemo(() => shortid(), []);
    const ref = useRef<HTMLDivElement>(null);
    const { config, items, setItems } = useContext(SortableContext);

    const item = items.find(item => item.key === key);

    // register the dom element ref with the container.
    useEffect(() => {
        setItems(s => [...s, { key, index, sorting: false, active: false, offset: { x: 0, y: 0 }, ref }]);
        return () => {
            setItems(s => s.filter(item => item.key !== key));
        }
    }, [key, index, ref, setItems]);

    // stop native touch scrolling in the config.direction
    useEffect(() => {
        const target = handle && handle.current ? handle.current : ref.current;
        if (target) {
            target.style.touchAction = `pan-${config.direction === 'x' ? 'y' : 'x'}`;
        }
    }, [handle, ref, config]);

    const onDown = useDragHandler<{ x: number, y: number, insertAt: number }>({
        onDown: e => {
            if (onPointerDown) {
                onPointerDown(e as any);
            }

            // cancel if not the left mouse button
            if (e.button === 2) {
                return false;
            }

            // cancel any pointerdown events not inside the handle
            if (handle && handle.current) {
                const target = e.target as HTMLDivElement;
                if (handle.current !== e.target && !handle.current.contains(target)) {
                    return false;
                }
            }

            setItems(items => {
                return items.map(item => {
                    return { ...item, active: item.key === key, sorting: true }
                });
            });

            // init mouse/pointer position
            return {
                x: e.screenX,
                y: e.screenY,
                insertAt: index
            }

        },
        onMove: (e, init) => {

            setItems(items => {

                if (config.direction === 'x') {
                    const offsetItemsBy = getAbsoluteWidth(ref.current);
                    init.insertAt = getInsertPointX(e, items, index);
                    return items.map(item => {
                        if (item.key === key) {
                            // if selected offset by pointer delta
                            return { ...item, offset: { x: e.screenX - init.x, y: 0 } }
                        } else {
                            // else offset by selection height
                            return { ...item, offset: { x: getOffset(item, init.insertAt, index, offsetItemsBy), y: 0 } }
                        }
                    });
                } else {
                    const offsetItemsBy = getAbsoluteHeight(ref.current);
                    init.insertAt = getInsertPointY(e, items, index);
                    return items.map(item => {
                        if (item.key === key) {
                            // if selected offset by pointer delta
                            return { ...item, offset: { y: e.screenY - init.y, x: 0 } }
                        } else {
                            // else offset by selection height
                            return { ...item, offset: { y: getOffset(item, init.insertAt, index, offsetItemsBy), x: 0 } }
                        }
                    });
                }
            });

        },
        onEnd: (e, init) => {
            config.onEnd(index, init.insertAt);
            setItems(items => {
                return items.map(item => {
                    return { ...item, sorting: false, active: false, offset: { x: 0, y: 0 } }
                });
            });
        }
    }, [key, config, items, index, handle, onPointerDown]);

    if (item) {
        return <div
            ref={ref}
            style={{
                transform: `translate(${item.offset.x}px,${item.offset.y}px)`,
                ...style
            }}
            onPointerDown={onDown}
            className={merge(
                'ui-sortable-item',
                {
                    'ui-sortable-item--active': item.active,
                    'ui-sortable-item--sorting': item.sorting
                },
                className
            )}
            {...props}
        >
            {children}
        </div>;
    } else {
        return null;
    }
}