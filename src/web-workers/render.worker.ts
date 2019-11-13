import { getConverter, Converter } from "../parse/converter";
import { loadFont } from "../render/load-font";
import { parse } from "../parse";
import { render } from "../render";
import { Score } from "../services/score";
import { FlowKey } from "../services/flow";

const ctx: Worker = self as any;

let ready = false;
let context: OffscreenCanvasRenderingContext2D | null;
let converter: (space: number) => Converter;
let score: Score;
let flowKey: FlowKey;

async function route(e: any) {
    switch (e.data.type) {
        case 'INIT': {

            const canvas: OffscreenCanvas = e.data.canvas;
            context = canvas.getContext('2d', { alpha: false, desynchronized: true });
            const mm: number = e.data.mm;
            converter = getConverter(mm);
            await loadFont('Music', '/bravura.woff2');
            await loadFont('Libre Baskerville', '/libre-baskerville.woff2');
            ready = true;

            if (context && score && flowKey) {
                run(context, score, flowKey);
            }

            break;

        }
        case 'UPDATE':
        default:
            score = e.data.score;
            flowKey = e.data.flowKey;
            if (ready && context && score && flowKey) {
                run(context, score, flowKey);
            }
            break;
    }
}

function run(context: OffscreenCanvasRenderingContext2D, score: Score, flowKey: FlowKey) {
    // console.time('render');
    const instructions = parse(score, flowKey, converter);
    render(context, instructions);
    // console.timeEnd('render');
}

ctx.addEventListener("message", route);

export default null as any;