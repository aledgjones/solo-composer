import {useMemo} from "react";
import {SLOT_HEIGHT} from "./get-tone-dimension";

export function useTrackBackground() {
    return useMemo(() => {
        const light = "#ffffff";
        const dark = "#cce4f1";

        const keyboardKeys = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
        const points = keyboardKeys.map((key, i) => {
            if (i % 12 === 4 || i % 12 === 11) {
                return `${light} ${SLOT_HEIGHT * i}px ${SLOT_HEIGHT * (i + 1) - 1}px, ${dark} ${
                    SLOT_HEIGHT * (i + 1) - 1
                }px ${SLOT_HEIGHT * (i + 1)}px`;
            } else if (key === 0) {
                return `${light} ${SLOT_HEIGHT * i}px ${SLOT_HEIGHT * (i + 1)}px`;
            } else {
                return `${dark} ${SLOT_HEIGHT * i}px ${SLOT_HEIGHT * (i + 1)}px`;
            }
        });
        return `linear-gradient(${points.join(",")})`;
    }, []);
}
