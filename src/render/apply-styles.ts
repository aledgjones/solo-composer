export type Styles = Partial<{
    color: string;
    thickness: number;
    fontFamily: string;
    fontSize: number;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
}>

export function applyStyles(ctx: OffscreenCanvasRenderingContext2D, { color, thickness, fontFamily, fontSize, textAlign, textBaseline }: Styles) {
    if (color) {
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
    }
    if (thickness) {
        ctx.lineWidth = thickness;
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