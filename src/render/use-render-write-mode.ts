import myWorker from '../web-workers/render.worker';

import { useEffect, useMemo } from "react";
import { Score } from "../services/score";
import { FlowKey } from "../services/flow";
import { getWidthOfMM } from '../parse/converter';

export function useRenderWriteMode(score: Score, flowKey: FlowKey) {

    const { worker, canvas, offscreen } = useMemo(() => {
        const worker: Worker = new myWorker();
        const canvas = document.createElement('canvas');
        const offscreen: any = canvas.transferControlToOffscreen();
        const mm = getWidthOfMM();
        worker.postMessage({ type: 'INIT', mm, canvas: offscreen }, [offscreen]);
        return { worker, canvas, offscreen };
    }, []);

    useEffect(() => {
        worker.postMessage({ type: 'UPDATE', score, flowKey }, []);
    }, [score, flowKey, offscreen, worker]);

    return canvas;
}
