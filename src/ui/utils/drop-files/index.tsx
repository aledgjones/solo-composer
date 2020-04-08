import React, { useCallback, useState, useEffect, CSSProperties, FC } from 'react';
import { fileAccepted } from '../file-accepted';

import './styles.css';
import { merge } from '../merge';
import { Icon } from '../../components/icon';
import { mdiFileUploadOutline } from '@mdi/js';

interface Props {
    id?: string;
    className?: string;
    style?: CSSProperties;

    accept?: string[],
    onDrop: (files: File[], discarded: number) => void;
}

export const DropFiles: FC<Props> = ({ id, className, style, children, accept, onDrop }) => {

    const [over, setOver] = useState(false);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        if (e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files);
            const filtered = files.filter(file => fileAccepted(file, accept));
            onDrop(filtered, files.length - filtered.length);
        }
    }, [accept, onDrop]);

    useEffect(() => {

        // prevent defaults makes drag and drop work
        const dragover = (e: Event) => {
            e.preventDefault();
        }

        const drop = (e: Event) => {
            e.preventDefault();
            setOver(false);
        }

        const dragenter = (e: any) => {
            // if we don't have an element we have come from, we are coming from outside the window
            if (e.relatedTarget == null) {
                setOver(true);
            };
        }

        const dragleave = (e: any) => {
            // if we don't have an element we are going to, we are going outside the window
            if (e.relatedTarget == null) {
                setOver(false);
            };
        }

        window.addEventListener('drop', drop);
        window.addEventListener('dragenter', dragenter);
        window.addEventListener('dragleave', dragleave);
        window.addEventListener('dragover', dragover);

        return () => {
            window.removeEventListener('drop', drop);
            window.removeEventListener('dragenter', dragenter);
            window.removeEventListener('dragleave', dragleave);
            window.removeEventListener('dragenter', dragover);
        }

    }, []);

    return <div
        id={id}
        className={merge('ui-dropzone', className)}
        onDrop={handleDrop}
        style={style}
    >
        {children}
        {over && <div className="ui-dropzone__hover-container">
            <div className="ui-dropzone__hover-content">
                <Icon path={mdiFileUploadOutline} size={48} color="#aaaaaa" />
                <p className="ui-dropzone__hover-text">Drop files here</p>
            </div>
        </div>}
    </div>;
}