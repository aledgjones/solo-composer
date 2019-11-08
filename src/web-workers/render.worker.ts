import { getConverter, Converter } from "../parse/converter";
import { loadFont } from "../render/load-font";
import { parse } from "../parse";
import { render } from "../render";
import { RenderInstructions } from "../render/instructions";

const ctx: Worker = self as any;

let ready = false;
let instructions: RenderInstructions;
let context: OffscreenCanvasRenderingContext2D | null;
let converter: (space: number) => Converter;

async function route(e: any) {
    switch (e.data.type) {
        case 'INIT': {
            const canvas: OffscreenCanvas = e.data.canvas;
            const mm: number = e.data.mm;
            context = canvas.getContext('2d');
            converter = getConverter(mm);
            await loadFont('Music', '/bravura.woff2');
            await loadFont('Libre Baskerville', 'https://fonts.gstatic.com/s/librebaskerville/v7/kmKnZrc3Hgbbcjq75U4uslyuy4kn0qNZaxM.woff2');
            ready = true;

            if (context && instructions) {
                render(context, instructions);
            }

            break;
        }
        case 'UPDATE':
        default:
            const score = e.data.score;
            const flowKey = e.data.flowKey;
            instructions = parse(score, flowKey, converter);
            console.log(instructions);
            if (ready && context) {
                render(context, instructions);
            }
            break;
    }
}

ctx.addEventListener("message", route);

export default null as any;