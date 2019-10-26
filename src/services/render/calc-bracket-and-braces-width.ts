import { SystemMetrics } from "./use-system-metrics";

export function calcBracketAndBracesWidth(metrics: SystemMetrics, space: number) {
    let max = metrics.brackets.length > 0 ? (space * 2) : 0;
    max = max + (metrics.subBrackets.length > 0 ? space : 0);

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