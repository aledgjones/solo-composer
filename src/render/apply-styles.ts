export type Styles = Partial<{
    color: string;
    thickness: number;
    font: string;
    size: number;
    align: CanvasTextAlign;
    baseline: CanvasTextBaseline;
}>

export function applyStyles(ctx: OffscreenCanvasRenderingContext2D, { color, thickness, font, size, align, baseline }: Styles, px: (spaces: number) => number) {
    if (color) {
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
    }
    if (thickness) {
        ctx.lineWidth = px(thickness);
    }
    if (font && size) {
        ctx.font = `${px(size)}px ${font}`;
    }
    if (align) {
        ctx.textAlign = align;
    }
    if (baseline) {
        ctx.textBaseline = baseline;
    }
}