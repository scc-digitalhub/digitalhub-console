import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

const CLARITY_KEY = import.meta.env.VITE_CLARITY_KEY;

export const ClarityInit = () => {
    useEffect(() => {
        if (!CLARITY_KEY) return;
        Clarity.init(CLARITY_KEY);
    }, []);

    return null;
};