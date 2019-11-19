import { getConverter, Converter, ConverterGenerator } from "../parse/converter";
import { loadFont } from "../render/load-font";
import { parse } from "../parse";
import { render } from "../render";
import { Score } from "../services/score";
import { FlowKey } from "../services/flow";
import { RenderInstructions } from "../parse/instructions";
import { Timer } from "../debug/timer";
import { defaultEngravingConfig, EngravingConfig } from "../services/engraving";
import { getConvertedConfig } from "../parse/get-converted-config";

const ctx: Worker = self as any;

let score: Score;
let flowKey: FlowKey;
let context: OffscreenCanvasRenderingContext2D | null;
let converterGenerator: ConverterGenerator;
let converter: Converter;
let config: EngravingConfig;
let instructions: RenderInstructions = { height: 200.0, width: 200.0, layers: { debug: [], score: [], selection: [] } };

async function route(e: any) {
    switch (e.data.type) {
        case 'INIT': {
            const canvas: OffscreenCanvas = e.data.canvas;
            const mm: number = e.data.mm;

            context = canvas.getContext('2d');
            converterGenerator = getConverter(mm);

            await loadFont('Music', '/bravura.woff2');
            await loadFont('Libre Baskerville', '/libre-baskerville.woff2');

            renderLoop();
            break;
        }
        case 'UPDATE':
        default:
            // const timer = Timer('parse');
            score = e.data.score;
            flowKey = e.data.flowKey;
            converter = converterGenerator(score.engraving.score.space || defaultEngravingConfig.space);
            config = getConvertedConfig({ ...defaultEngravingConfig, ...score.engraving.score }, converter);
            instructions = parse(score, flowKey, config, converter);
            // timer.stop();
            break;
    }
}

function renderLoop() {
    if (context) {
        render(context, instructions, converter);
    }
    requestAnimationFrame(renderLoop);
}

ctx.addEventListener("message", route);

export default null as any;