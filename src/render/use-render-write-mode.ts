import myWorker from '../web-workers/render.worker';

import { useEffect, useMemo } from "react";
import { Score } from "../services/score";
import { FlowKey } from "../services/flow";
import { getWidthOfMM } from '../parse/converter';
import { RenderEvents } from './render-events';

export function useRenderWriteMode(score: Score, flowKey: FlowKey) {

    const { worker, canvas, offscreen } = useMemo(() => {
        const worker: Worker = new myWorker();
        const canvas = document.createElement('canvas');
        const offscreen: any = canvas.transferControlToOffscreen();
        const mm = getWidthOfMM();
        worker.postMessage({ type: RenderEvents.Init, mm, canvas: offscreen }, [offscreen]);
        return { worker, canvas, offscreen };
    }, []);

    useEffect(() => {
        worker.postMessage({ type: 'UPDATE', score, flowKey }, []);
    }, [score, flowKey, offscreen, worker]);

    useEffect(() => {
        const cb = (e: any) => {
            canvas.style.height = `${e.data.height / (window.devicePixelRatio)}px`;
            canvas.style.width = `${e.data.width / (window.devicePixelRatio)}px`;
        }
        worker.addEventListener('message', cb);
        return () => {
            worker.removeEventListener('message', cb);
            worker.terminate();
        }
    }, [worker, canvas]);

    return canvas;
}
