import { useMemo } from "react";
import Color from "color";

export function useForeground(color: string) {
    return useMemo(() => Color(color).isDark() ? '#ffffff' : '#000000', [color]);
}