import { useEffect, useRef } from "react";

export const useInterval = (callback, delay) => {
    const saveCallback = useRef();

    //rememder the last callback
    useEffect(() => {
        saveCallback.current = callback
    }, [callback]);

    //set up the interval

    useEffect(() => {
        function tick() {
            saveCallback.current();
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => {
                clearInterval(id);
            };
        }
    }, [delay]);
};