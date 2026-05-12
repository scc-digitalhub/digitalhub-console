import Clarity from '@microsoft/clarity';

const clarityKey = import.meta.env.VITE_CLARITY_KEY;

if (clarityKey) {
    Clarity.init(clarityKey);
}