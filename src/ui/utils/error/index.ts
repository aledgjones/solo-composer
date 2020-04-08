export function error(code: string = "@general/unknown-error", message: string = "Something went wrong. Please try again.") {
    return { code, message };
}