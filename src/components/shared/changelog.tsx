import React, { useState, useEffect } from 'react';
import { Backdrop, Card, Icon } from '../../ui';
import { MarkdownContent } from '../../ui/widgets/markdown-content';
import { THEME } from '../../const';
import { mdiClose } from '@mdi/js';

import './changelog.css';

export const Changelog = () => {

    const [show, setShow] = useState(true || process.env.NODE_ENV === 'production');
    const [md, setMd] = useState('');

    useEffect(() => {
        (async function call() {
            const resp = await fetch('/CHANGELOG.md');
            const text = await resp.text();
            setMd(text);
        })();
    }, []);

    if (show) {
        return <Backdrop visible={true}>
            <Card className="changelog__card">
                <div className="changelog__head">
                    <h2 className="changelog__h2">About</h2>
                    <Icon path={mdiClose} size={24} color="#000000" onClick={() => setShow(false)} />
                </div>
                <MarkdownContent className="changelog__content" markdown={md} theme={THEME.primary[500].bg} />
            </Card>
        </Backdrop>;
    } else {
        return null;
    }
}