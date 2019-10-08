import { useEffect } from 'react';
import { isString } from 'lodash';

export function useStyles(cssRules: string | string[]) {

    useEffect(() => {
        const style = document.createElement("style");
        style.appendChild(document.createTextNode(""));
        document.head.appendChild(style);
        const sheet: any = style.sheet;

        if (isString(cssRules)) {
            sheet.insertRule(cssRules);
        } else {
            cssRules.forEach(css => {
                sheet.insertRule(css);
            });
        }

        return () => {
            style.remove();
        }
    }, [cssRules]);

}