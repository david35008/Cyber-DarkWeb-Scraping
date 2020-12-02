import { useState, useEffect } from "react";

export default function useEventSource(url) {
    const [data, updateData] = useState(null);

    useEffect(() => {
        const source = new EventSource(url);

        source.onmessage = function logEvents(event) {
            updateData(JSON.parse(event.data));
        };
    }, []);

    return data;
}
