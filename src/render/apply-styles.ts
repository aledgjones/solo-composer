export enum Justify {
    start = "flex-start",
    middle = "center",
    end = "flex-end"
}

export enum Align {
    top = 'flex-start',
    middle = 'center',
    bottom = 'flex-end'
}

export type Styles = Partial<{
    font: string;
    size: number;
}>

export function applyStyles(ctx: OffscreenCanvasRenderingContext2D, { font, size }: Styles, px: (spaces: number) => number) {
    if (font && size) {
        ctx.font = `${px(size)}px ${font}`;
    }
}