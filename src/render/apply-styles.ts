export type Styles = Partial<{
    color: string;
    width: number;
    fontFamily: string;
    fontSize: number;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
}>

export function applyStyles(ctx: OffscreenCanvasRenderingContext2D, { color, width, fontFamily, fontSize, textAlign, textBaseline }: Styles) {
    if (color) {
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
    }
    if (width) {
        ctx.lineWidth = width;
    }
    if (fontFamily && fontSize) {
        ctx.font = `${fontSize}px ${fontFamily}`;
    }
    if (textAlign) {
        ctx.textAlign = textAlign;
    }
    if (textBaseline) {
        ctx.textBaseline = textBaseline;
    }
}