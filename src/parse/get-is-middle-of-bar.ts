export function getMiddleOfBar(beatGroupings: number[]) {
    const i = Math.floor(beatGroupings.length / 2);
    return beatGroupings[i];
}