const light = '#ffffff';
const dark = '#cce4f1';

const keyboardKeys = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
const height = 224 / 24;
const points = keyboardKeys.map((key, i) => {
    if (i % 12 === 11 || i % 12 === 4) {
        return `${light} ${height * i}px, ${light} ${height * (i + 1)}px, ${dark} ${height * (i + 1)}px, ${dark} ${height * (i + 1) + 1}px`;
    } else if (key === 0) {
        return `${light} ${height * i}px, ${light} ${height * (i + 1)}px`;
    } else {
        return `${dark} ${height * i}px, ${dark} ${height * (i + 1)}px`;
    }
});

export const background = `repeating-linear-gradient(${points.join(',')})`;