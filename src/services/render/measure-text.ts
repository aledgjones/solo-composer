export function measureText(text: string, font: string, ctx: CanvasRenderingContext2D): number {
    ctx.font = font;
    return ctx.measureText(text).width;
}