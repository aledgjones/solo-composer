import { useMemo } from "react";

export function useRainbow(count: number) {
    return useMemo(() => {

        const len = count > 9 ? count : 9;

        const offset = 206;
        const width = 359 - 100;
        const step = Math.floor(width / len);

        return Array(len).fill('').map((entry, i) => {
            const base = (step * i) + offset;
            const color = `hsl(${base > 359 ? base - 359 : base}, 100%, 35%)`;
            return color;
        });

    }, [count]);
}