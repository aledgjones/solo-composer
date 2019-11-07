import { useMemo } from "react";

export type Point = [number, number];
export type Path = Point[];
export type Styles = Partial<{
    color: string;
    width: number;
    fontFamily: string;
    fontSize: number;
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
}>

export abstract class Renderer {
    abstract frame(): HTMLElement;

    abstract height(height: number): void;
    abstract width(width: number): void;
    abstract clear(color: string): void;
    abstract measureText(styles: Styles, text: string): number;
    abstract paths(styles: Styles, ...paths: Path[]): void;
    abstract path(styles: Styles, ...path: Point[]): void;
    abstract text(styles: Styles, text: string, x: number, y: number): void;
}

export function useRenderer() {
    return useMemo(() => {
        return new CanvasRenderer();
    }, []);
}

export class CanvasRenderer extends Renderer {

    public frame() {
        return this.canvas;
    }

    private canvas = document.createElement('canvas');
    private ctx = this.canvas.getContext('2d', { alpha: false });

    constructor() {
        super();
    };

    private style({ color, width, fontFamily, fontSize, textAlign, textBaseline }: Styles) {
        if (!this.ctx) return;
        if (color) {
            this.ctx.fillStyle = color;
            this.ctx.strokeStyle = color;
        }
        if (width) {
            this.ctx.lineWidth = width;
        }
        if (fontFamily && fontSize) {
            this.ctx.font = `${fontSize}px ${fontFamily}`;
        }
        if (textAlign) {
            this.ctx.textAlign = textAlign;
        }
        if (textBaseline) {
            this.ctx.textBaseline = textBaseline;
        }
    }

    public height(height: number) {
        if (!this.ctx) return;
        this.ctx.canvas.height = height;
    }

    public width(width: number) {
        if (!this.ctx) return;
        this.ctx.canvas.width = width;
    }

    public clear(color: string) {
        if (!this.ctx) return;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    public measureText(styles: Styles, text: string) {
        if (!this.ctx) return 0;
        this.style(styles);
        const width = this.ctx.measureText(text).width;
        return Math.ceil(width);
    }

    public paths(styles: Styles, ...paths: Path[]) {
        if (!this.ctx) return;
        this.style(styles);
        this.ctx.beginPath();
        paths.forEach(path => {
            path.forEach((point, i) => {
                if (!this.ctx) return;
                if (i === 0) {
                    this.ctx.moveTo(point[0], point[1]);
                } else {
                    this.ctx.lineTo(point[0], point[1])
                }
            });
        });
        this.ctx.stroke();
    }

    public path(styles: Styles, ...path: Point[]) {
        if (!this.ctx) return;
        this.style(styles);
        this.ctx.beginPath();
        path.forEach((point, i) => {
            if (!this.ctx) return;
            if (i === 0) {
                this.ctx.moveTo(point[0], point[1]);
            } else {
                this.ctx.lineTo(point[0], point[1])
            }
        });
        this.ctx.stroke();
    }

    public text(styles: Styles, text: string, x: number, y: number) {
        if (!this.ctx) return;
        this.style(styles);
        this.ctx.fillText(text, x, y);
    }
}

