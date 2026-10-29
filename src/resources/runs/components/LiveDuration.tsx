import { useState, useEffect } from 'react';
import { formatDuration } from '../../../common/utils/helpers';

export const LiveDuration = ({ startedAt }: { startedAt: number }) => {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    return formatDuration(now - startedAt).asString;
};
