import { useEffect, useState, FC } from 'react';
import ReactDOM from 'react-dom';

import './styles.css';

export const Portal: FC = ({ children }) => {

    const [container, setContainer] = useState();

    useEffect(() => {

        const $container = document.createElement('div');
        $container.className = 'ui-portal';
        document.body.appendChild($container);
        setContainer($container);

        return () => {
            $container.remove();
        }

    }, []);

    if (container) {
        return ReactDOM.createPortal(children, container);
    } else {
        return null;
    }
}