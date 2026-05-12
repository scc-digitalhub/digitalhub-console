import Clarity from '@microsoft/clarity';

const clarityKey: string =
    import.meta.env.REACT_APP_CLARITY_KEY ||
    (globalThis as any).REACT_APP_CLARITY_KEY ||
    (process.env.REACT_APP_CLARITY_KEY as string);

if (clarityKey) {
    Clarity.init(clarityKey);
}