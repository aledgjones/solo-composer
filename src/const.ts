export const APP_SHORT_NAME = "Composer";
export const APP_FULL_NAME = "Solo Composer";
export const APP_CREATOR = "Solo Apps";
export const APP_VERSION = "0.6.0";

interface Theme {
    [key: string]: {
        [shade: number]: {backgroundColor: string; color: string};
    };
}

export const THEME: Theme = {
    grey: {
        300: {backgroundColor: "#101010", color: "#ffffff"},
        350: {backgroundColor: "#131313", color: "#ffffff"},
        400: {backgroundColor: "#161616", color: "#ffffff"},
        500: {backgroundColor: "#1f1f1f", color: "#ffffff"},
        600: {backgroundColor: "#282828", color: "#ffffff"},
        700: {backgroundColor: "#2E2E2E", color: "#ffffff"},
        800: {backgroundColor: "#505050", color: "#ffffff"}
    },
    primary: {
        400: {backgroundColor: "#00508e", color: "#ffffff"},
        500: {backgroundColor: "#0064b1", color: "#ffffff"},
        600: {backgroundColor: "#0082e6", color: "#ffffff"},
        700: {backgroundColor: "#1c9cff", color: "#ffffff"}
    },
    highlight: {
        500: {backgroundColor: "orange", color: "#ffffff"}
    },
    error: {
        500: {backgroundColor: "#ff6347", color: "#ffffff"}
    }
};
