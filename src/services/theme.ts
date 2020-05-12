import { Store } from "pullstate";
import { State } from "./state";

export interface Shade {
    bg: string;
    fg: string;
}

export interface Pallet {
    200: Shade;
    300: Shade;
    400: Shade;
    500: Shade;
    600: Shade;
    700: Shade;
    800: Shade;
}

export interface ThemeState {
    // refs to bind selects to
    mode: ThemeMode;

    pallets: {
        background: Pallet;
        primary: Pallet;
        highlight: string;
        error: string;
    };
}

export enum ThemeMode {
    light = "light",
    dark = "dark",
    auto = "auto"
}

interface Pallets {
    [key: string]: Pallet;
}

export const pallets: Pallets = {
    [ThemeMode.dark]: {
        200: { bg: "#101010", fg: "#ffffff" },
        300: { bg: "#131313", fg: "#ffffff" },
        400: { bg: "#161616", fg: "#ffffff" },
        500: { bg: "#1f1f1f", fg: "#ffffff" },
        600: { bg: "#282828", fg: "#ffffff" },
        700: { bg: "#2E2E2E", fg: "#ffffff" },
        800: { bg: "#505050", fg: "#ffffff" }
    },
    [ThemeMode.light]: {
        200: { bg: "#ffffff", fg: "#323232" },
        300: { bg: "#9f9f9f", fg: "#323232" },
        400: { bg: "#aaaaaa", fg: "#323232" },
        500: { bg: "#e8e8e8", fg: "#323232" },
        600: { bg: "#b8b8b8", fg: "#323232" },
        700: { bg: "#c8c8c8", fg: "#323232" },
        800: { bg: "#eeeeee", fg: "#323232" }
    }
};

export function themeEmptyState(): ThemeState {
    const mode = (localStorage.getItem("sc:theme-mode/v1") as ThemeMode) || ThemeMode.dark;
    const isLight =
        mode === ThemeMode.light ||
        (mode === ThemeMode.auto && window.matchMedia("(prefers-color-scheme: light)").matches);
    return {
        mode,
        pallets: {
            background: isLight ? pallets[ThemeMode.light] : pallets[ThemeMode.dark],
            primary: {
                200: { bg: "", fg: "" },
                300: { bg: "", fg: "" },
                400: { bg: "#00508e", fg: "#ffffff" },
                500: { bg: "#0064b1", fg: "#ffffff" },
                600: { bg: "#0082e6", fg: "#ffffff" },
                700: { bg: "#1c9cff", fg: "#ffffff" },
                800: { bg: "#49b0ff", fg: "#ffffff" }
            },
            highlight: "orange",
            error: "#ff6347"
        }
    };
}

export function themeActions(store: Store<State>) {
    return {
        init: () => {
            const query = window.matchMedia("(prefers-color-scheme: light)");
            query.addListener((e) => {
                store.update((s) => {
                    if (s.ui.theme.mode === ThemeMode.auto) {
                        const isLight = e.matches;
                        s.ui.theme.pallets.background = isLight ? pallets[ThemeMode.light] : pallets[ThemeMode.dark];
                    }
                });
            });
        },
        mode: (mode: ThemeMode) => {
            localStorage.setItem("sc:theme-mode/v1", mode);
            store.update((s) => {
                s.ui.theme.mode = mode;
                const isLight =
                    mode === ThemeMode.light ||
                    (mode === ThemeMode.auto && window.matchMedia("(prefers-color-scheme: light)").matches);
                s.ui.theme.pallets.background = isLight ? pallets[ThemeMode.light] : pallets[ThemeMode.dark];
            });
        }
    };
}
