import { Converter } from "./converter";
import { TextStyles } from "../render/text";

export function measureText(styles: TextStyles, text: string, converter: Converter) {
    const canvas = new OffscreenCanvas(1000, 100);
    const ctx = canvas.getContext("2d");
    if (ctx) {
        const { size, font } = styles;
        ctx.font = `${converter.spaces.toPX(size)}px ${font}`;
        return converter.px.toSpaces(ctx.measureText(text).width);
    } else {
        return 0;
    }
}
