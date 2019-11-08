export function clearCanvas(ctx: OffscreenCanvasRenderingContext2D, color?: string) {
    ctx.fillStyle = color || '#ffffff';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}