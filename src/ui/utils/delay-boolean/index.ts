import { useState, useEffect } from "react";

export function useDelayBoolean(master: boolean, delay: number) {
    const [slave, setSlave] = useState(false);
    
    useEffect(() => {
        let timeout: NodeJS.Timer;
        if (master) {
            setSlave(true);
        } else {
            timeout = setTimeout(() => setSlave(false), delay);
        }
        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        }
    }, [master, delay]);

    return slave;
}