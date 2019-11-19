import { VerticalMeasurements } from "./measure-vertical-layout";

export function measureBracketAndBraces(metrics: VerticalMeasurements) {
    let max = metrics.brackets.length > 0 ? 1 : 0;
    max = max + (metrics.subBrackets.length > 0 ? .5 : 0);

    metrics.braces.forEach(brace => {
        const start = metrics.staves[brace.start];
        const stop = metrics.staves[brace.stop];
        const height = (stop.y + stop.height) - start.y;
        const width = height * .1;
        if (width > max) {
            max = width;
        }
    });

    return max;
}