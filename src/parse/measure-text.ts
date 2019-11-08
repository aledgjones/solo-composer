import { Styles, applyStyles } from "../render/apply-styles";

export function measureText(styles: Styles, text: string) {
    const canvas = new OffscreenCanvas(1000, 100);
    const ctx = canvas.getContext('2d');
    if (ctx) {
        applyStyles(ctx, styles);
        return ctx.measureText(text).width;
    } else {
        return 0;
    }
}