import Big from 'big.js';

export interface Converter {
    mm: {
        toPX: (mm: number) => number;
    }
    spaces: {
        toPX: (spaces: number) => number;
    }
}

export function getWidthOfMM() {
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.width = '1mm';
    document.body.appendChild(div);
    const width = div.clientWidth;
    document.body.removeChild(div);
    return width;
}

export function getConverter(width: number) {
    return (space: number): Converter => {
        return {
            mm: {
                toPX: (mm: number) => parseFloat(new Big(mm).times(width).round(2, 1).toString())
            },
            spaces: {
                toPX: (spaces: number) => parseFloat(new Big(spaces).times(space).times(width).round(2, 1).toString())
            }
        }
    };
};