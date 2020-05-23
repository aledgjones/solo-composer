import { Store } from "pullstate";
import { State } from "./state";
import { localconfig } from "./localstorage";

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
        200: { bg: "#ffffff", fg: "#323232" }, //
        300: { bg: "#e9e9e9", fg: "#323232" }, //
        400: { bg: "#e9e9e9", fg: "#323232" }, //
        500: { bg: "#e0e0e0", fg: "#323232" }, //
        600: { bg: "#d7d7d7", fg: "#323232" }, //
        700: { bg: "#d1d1d1", fg: "#323232" }, //
        800: { bg: "#afafaf", fg: "#323232" } //
    }
};

export function themeEmptyState(): ThemeState {
    return {
        mode: ThemeMode.dark,
        pallets: {
            background: pallets[ThemeMode.dark],
            primary: {
                200: { bg: "", fg: "" },
                300: { bg: "", fg: "" },
                400: { bg: "#00508e", fg: "#ffffff" },
                500: { bg: "#0064b1", fg: "#ffffff" },
                600: { bg: "#1a74b9", fg: "#ffffff" },
                700: { bg: "#3383c1", fg: "#ffffff" },
                800: { bg: "#4d93c9", fg: "#ffffff" }
            },
            highlight: "orange",
            error: "#ff6347"
        }
    };
}

export function themeActions(store: Store<State>) {
    const isLight = (mode: ThemeMode) => {
        return (
            mode === ThemeMode.light ||
            (mode === ThemeMode.auto && window.matchMedia("(prefers-color-scheme: light)").matches)
        );
    };

    return {
        init: async () => {
            // get initial value
            const mode = (await localconfig.getItem<ThemeMode>("theme-mode/v1")) || ThemeMode.dark;
            store.update((s) => {
                s.app.theme.mode = mode;
                s.app.theme.pallets.background = isLight(mode) ? pallets[ThemeMode.light] : pallets[ThemeMode.dark];
            });
            // listen for system theme change
            const query = window.matchMedia("(prefers-color-scheme: light)");
            query.addListener((e) => {
                store.update((s) => {
                    if (s.app.theme.mode === ThemeMode.auto) {
                        const isLight = e.matches;
                        s.app.theme.pallets.background = isLight ? pallets[ThemeMode.light] : pallets[ThemeMode.dark];
                    }
                });
            });
        },
        mode: (mode: ThemeMode) => {
            localconfig.setItem("theme-mode/v1", mode);
            store.update((s) => {
                s.app.theme.mode = mode;
                s.app.theme.pallets.background = isLight(mode) ? pallets[ThemeMode.light] : pallets[ThemeMode.dark];
            });
        }
    };
}
