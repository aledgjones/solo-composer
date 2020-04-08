import { useEffect } from "react";

export function useTheme(color: string) {
    useEffect(() => {
        const metaThemeColor = document.querySelector("meta[name=theme-color]");
        if (metaThemeColor) {
            metaThemeColor.setAttribute("content", color);
        }
    }, [color]);
}