import Big from 'big.js';

export type ConverterGenerator = (space: number) => Converter;

export interface Converter {
    px: {
        toSpaces: (px: number) => number;
    }
    mm: {
        toPX: (mm: number) => number;
        toSpaces: (mm: number) => number;
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
    return width * (window.devicePixelRatio);
}

export function getConverter(width: number) {

    const accuracy = 2;

    return (space: number): Converter => {
        return {
            px: {
                toSpaces: (px: number) => {
                    const mm = new Big(px).div(width);
                    return parseFloat(mm.div(space).toFixed(accuracy));
                }
            },
            mm: {
                toPX: (mm: number) => parseFloat(new Big(mm).times(width).toFixed(accuracy)),
                toSpaces: (mm: number) => parseFloat(new Big(mm).div(space).toFixed(accuracy))
            },
            spaces: {
                toPX: (spaces: number) => parseFloat(new Big(spaces).times(space).times(width).toFixed(accuracy))
            }
        }
    };
};