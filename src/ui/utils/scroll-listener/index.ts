import { useEffect, useState } from "react";

export const useScrollListener = () => {

    const [y, setY] = useState(0.0);
    useEffect(() => {
        const cb = () => {
            setY(window.scrollY);
        }

        window.addEventListener('scroll', cb, { passive: true });
        return () => {
            window.removeEventListener('scroll', cb);
        }
    });

    return y;

}