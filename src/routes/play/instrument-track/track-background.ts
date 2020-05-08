import {useMemo} from "react";
import {SLOT_HEIGHT} from "./get-tone-dimension";

export function useTrackBackground() {
    return useMemo(() => {
        const light = "#ffffff";
        const dark = "#cce4f1";

        const keyboardKeys = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
        const points = keyboardKeys.map((key, i) => {
            if (i % 12 === 11 || i % 12 === 4) {
                return `${light} ${SLOT_HEIGHT * i}px, ${light} ${SLOT_HEIGHT * (i + 1)}px, ${dark} ${
                    SLOT_HEIGHT * (i + 1)
                }px, ${dark} ${SLOT_HEIGHT * (i + 1) + 1}px`;
            } else if (key === 0) {
                return `${light} ${SLOT_HEIGHT * i}px, ${light} ${SLOT_HEIGHT * (i + 1)}px`;
            } else {
                return `${dark} ${SLOT_HEIGHT * i}px, ${dark} ${SLOT_HEIGHT * (i + 1)}px`;
            }
        });
        return `repeating-linear-gradient(${points.join(",")})`;
    }, []);
}
