import Big from 'big.js';

export const { px, mm } = (() => {
    const div = document.createElement('div');
    div.style.position = 'fixed';
    div.style.width = '1mm';
    document.body.appendChild(div);
    const width = div.clientWidth;
    document.body.removeChild(div);
    return {
        mm: (px: number) => parseFloat(new Big(px).div(width).toFixed(0)),
        px: (mm: number) => parseFloat(new Big(mm).times(width).toFixed(0))
    };
})();