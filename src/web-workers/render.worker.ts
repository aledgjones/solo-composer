import { getConverter, Converter } from "../parse/converter";
import { loadFont } from "../render/load-font";
import { parse } from "../parse";
import { render } from "../render";
import { Score } from "../services/score";
import { FlowKey } from "../services/flow";
import { RenderInstructions } from "../parse/instructions";
import { Timer } from "../debug/timer";

const ctx: Worker = self as any;

let score: Score;
let flowKey: FlowKey;
let context: OffscreenCanvasRenderingContext2D | null;
let converter: (space: number) => Converter;
let instructions: RenderInstructions = { height: 200.0, width: 200.0, layers: { debug: [], score: [], selection: [] } };

async function route(e: any) {
    switch (e.data.type) {
        case 'INIT': {
            const canvas: OffscreenCanvas = e.data.canvas;
            context = canvas.getContext('2d', { alpha: false, desynchronized: true });
            const mm: number = e.data.mm;
            converter = getConverter(mm);
            await loadFont('Music', '/bravura.woff2');
            await loadFont('Libre Baskerville', '/libre-baskerville.woff2');
            instructions = parse(score, flowKey, converter);
            renderLoop();
            break;
        }
        case 'UPDATE':
        default:
            const timer = Timer('parse');
            timer.start();
            score = e.data.score;
            flowKey = e.data.flowKey;
            instructions = parse(score, flowKey, converter);
            timer.stop();
            break;
    }
}

function renderLoop() {
    if (context) {
        render(context, instructions);
    }
    requestAnimationFrame(renderLoop);
}

ctx.addEventListener("message", route);

export default null as any;