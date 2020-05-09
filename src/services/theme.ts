import {Store} from "pullstate";
import {State} from "./state";

export interface ThemeDef {
    bg: string;
    fg: string;
}

export interface ThemeShades {
    200: ThemeDef;
    300: ThemeDef;
    400: ThemeDef;
    500: ThemeDef;
    600: ThemeDef;
    700: ThemeDef;
    800: ThemeDef;
}

interface ThemeDefGroup {
    [key: string]: ThemeShades;
}

export interface ThemeState {
    // refs to bind selects to
    mode: ThemeMode;
    primary: ThemeColor;

    pallets: {
        background: ThemeShades;
        primary: ThemeShades;
        highlight: string;
        error: string;
    };
}

export enum ThemeMode {
    light = "light",
    dark = "dark"
}

export const themeType: ThemeDefGroup = {
    [ThemeMode.dark]: {
        200: {bg: "#101010", fg: "#ffffff"},
        300: {bg: "#131313", fg: "#ffffff"},
        400: {bg: "#161616", fg: "#ffffff"},
        500: {bg: "#1f1f1f", fg: "#ffffff"},
        600: {bg: "#282828", fg: "#ffffff"},
        700: {bg: "#2E2E2E", fg: "#ffffff"},
        800: {bg: "#505050", fg: "#ffffff"}
    },
    [ThemeMode.light]: {
        200: {bg: "#ffffff", fg: "#323232"},
        300: {bg: "#9f9f9f", fg: "#323232"},
        400: {bg: "#aaaaaa", fg: "#323232"},
        500: {bg: "#e8e8e8", fg: "#323232"},
        600: {bg: "#b8b8b8", fg: "#323232"},
        700: {bg: "#c8c8c8", fg: "#323232"},
        800: {bg: "#eeeeee", fg: "#323232"}
    }
};

export enum ThemeColor {
    blue = "blue",
    green = "green",
    brown = "brown",
    orange = "orange",
    purple = "purple"
}

export const themeColor: ThemeDefGroup = {
    [ThemeColor.blue]: {
        200: {bg: "", fg: ""},
        300: {bg: "", fg: ""},
        400: {bg: "#00508e", fg: "#ffffff"},
        500: {bg: "#0064b1", fg: "#ffffff"},
        600: {bg: "#0082e6", fg: "#ffffff"},
        700: {bg: "#1c9cff", fg: "#ffffff"},
        800: {bg: "", fg: ""}
    },
    [ThemeColor.green]: {
        200: {bg: "#2E7D32", fg: "#ffffff"},
        300: {bg: "#388E3C", fg: "#ffffff"},
        400: {bg: "#43A047", fg: "#ffffff"},
        500: {bg: "#4CAF50", fg: "#ffffff"},
        600: {bg: "#66BB6A", fg: "#ffffff"},
        700: {bg: "#81C784", fg: "#000000"},
        800: {bg: "#A5D6A7", fg: "#000000"}
    },
    [ThemeColor.brown]: {
        200: {bg: "#4E342E", fg: "#ffffff"},
        300: {bg: "#5D4037", fg: "#ffffff"},
        400: {bg: "#6D4C41", fg: "#ffffff"},
        500: {bg: "#795548", fg: "#ffffff"},
        600: {bg: "#8D6E63", fg: "#ffffff"},
        700: {bg: "#A1887F", fg: "#000000"},
        800: {bg: "#BCAAA4", fg: "#000000"}
    },
    [ThemeColor.orange]: {
        200: {bg: "#EF6C00", fg: "#000000"},
        300: {bg: "#F57C00", fg: "#000000"},
        400: {bg: "#FB8C00", fg: "#000000"},
        500: {bg: "#FF9800", fg: "#000000"},
        600: {bg: "#FFA726", fg: "#000000"},
        700: {bg: "#FFB74D", fg: "#000000"},
        800: {bg: "#FFCC80", fg: "#000000"}
    },
    [ThemeColor.purple]: {
        200: {bg: "#6A1B9A", fg: "#ffffff"},
        300: {bg: "#7B1FA2", fg: "#ffffff"},
        400: {bg: "#8E24AA", fg: "#ffffff"},
        500: {bg: "#9C27B0", fg: "#ffffff"},
        600: {bg: "#AB47BC", fg: "#ffffff"},
        700: {bg: "#BA68C8", fg: "#000000"},
        800: {bg: "#CE93D8", fg: "#000000"}
    }
};

export function themeEmptyState(): ThemeState {
    const mode = (localStorage.getItem("sc:theme-mode/v1") as ThemeMode) || ThemeMode.dark;
    const primary = (localStorage.getItem("sc:theme-color/v1") as ThemeColor) || ThemeColor.blue;
    return {
        mode,
        primary,

        pallets: {
            background: themeType[mode],
            primary: themeColor[primary],
            highlight: "orange",
            error: "#ff6347"
        }
    };
}

export function themeActions(store: Store<State>) {
    return {
        mode: (def: ThemeMode) => {
            localStorage.setItem("sc:theme-mode/v1", def);
            store.update((s) => {
                s.ui.theme.mode = def;
                s.ui.theme.pallets.background = themeType[ThemeMode[def]];
            });
        },
        primary: (def: ThemeColor) => {
            localStorage.setItem("sc:theme-color/v1", def);
            store.update((s) => {
                s.ui.theme.primary = def;
                s.ui.theme.pallets.primary = themeColor[ThemeColor[def]];
            });
        }
    };
}
