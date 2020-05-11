import {useMemo} from "react";
import {SLOT_HEIGHT} from "../instrument-track/get-tone-dimension";

export function useKeyboardBackground() {
    return useMemo(() => {
        const light = "transparent";
        const dark = "#000000";

        const keyboardKeys = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
        const whiteKeyHeight = (SLOT_HEIGHT * 12) / 7;

        const whiteKeys = Array(7)
            .fill("")
            .map((none, i) => {
                return `${light} ${whiteKeyHeight * i + 1}px ${whiteKeyHeight * (i + 1) - 1}px, ${dark} ${
                    whiteKeyHeight * (i + 1) - 1
                }px ${whiteKeyHeight * (i + 1) + 1}px`;
            });

        const blackKeys = keyboardKeys.map((key, i) => {
            if (key === 0) {
                return `${light} ${SLOT_HEIGHT * i}px ${SLOT_HEIGHT * (i + 1)}px`;
            } else {
                return `${dark} ${SLOT_HEIGHT * i}px ${SLOT_HEIGHT * (i + 1)}px`;
            }
        });

        return `linear-gradient(${whiteKeys.join(",")}), linear-gradient(${blackKeys.join(",")})`;
    }, []);
}
