import Big from 'big.js';
import { useMemo } from 'react';

export interface Converter {
    px: {
        toMM: (px: number) => number;
    }
    mm: {
        toPX: (mm: number) => number;
    }
    spaces: {
        toPX: (spaces: number) => number;
    }
}

export function useConverter(space: number): Converter {
    return useMemo(() => {
        const div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.width = '1mm';
        document.body.appendChild(div);
        const width = div.clientWidth;
        document.body.removeChild(div);
        return {
            px: {
                toMM: (px: number) => parseFloat(new Big(px).div(width).toFixed(2))
            },
            mm: {
                toPX: (mm: number) => parseFloat(new Big(mm).times(width).toFixed(2))
            },
            spaces: {
                toPX: (spaces: number) => parseFloat(new Big(spaces).times(space).times(width).toFixed(2))
            }
        };
    }, [space]);
};