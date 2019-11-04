export function measureText(text: string, font: string, ctx: CanvasRenderingContext2D): number {
    ctx.font = font;
    const width = ctx.measureText(text).width;
    return Math.ceil(width);
}