import { Styles, applyStyles } from "../render/apply-styles";
import { Converter } from "./converter";

export function measureText(styles: Styles, text: string, converter: Converter) {
    const canvas = new OffscreenCanvas(1000, 100);
    const ctx = canvas.getContext('2d');
    if (ctx) {
        applyStyles(ctx, styles, converter.spaces.toPX);
        return converter.px.toSpaces(ctx.measureText(text).width);
    } else {
        return 0;
    }
}