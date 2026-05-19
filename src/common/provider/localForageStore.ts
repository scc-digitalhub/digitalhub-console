import localforage from 'localforage';
import { Store } from 'react-admin';

const forageInstance = localforage.createInstance({
    name: 'platformadmin',
    storeName: 'dh',
    driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE], 
});

const memoryCache: Record<string, any> = {};
const subscribers: Record<string, Set<(value: any) => void>> = {};

const notify = (key: string) => {
    subscribers[key]?.forEach(fn => fn(memoryCache[key]));
};

/**
 * Precarica tutto da IndexedDB nella cache in memoria.
 * Va chiamato PRIMA di montare React.
 */
export const preloadStore = async (): Promise<void> => {
    await forageInstance.iterate((value, key) => {
        memoryCache[key] = value;
    });
};

export const localForageStore = (): Store => ({
    getItem<T>(key: string, defaultValue?: T): T {
        return key in memoryCache ? memoryCache[key] : (defaultValue as T);
    },
    setItem<T>(key: string, value: T): void {
        memoryCache[key] = value;
        forageInstance.setItem(key, value);
        notify(key);
    },
    removeItem(key: string): void {
        delete memoryCache[key];
        forageInstance.removeItem(key);
        notify(key);
    },
    removeItems(keyPrefix: string): void {
        Object.keys(memoryCache).forEach(k => {
            if (k.startsWith(keyPrefix)) {
                delete memoryCache[k];
                forageInstance.removeItem(k);
                notify(k);
            }
        });
    },
    reset(): void {
        Object.keys(memoryCache).forEach(k => delete memoryCache[k]);
        forageInstance.clear();
    },
    setup(): void {},
    teardown(): void {},
    subscribe(key: string, callback: (value: any) => void) {
        if (!subscribers[key]) subscribers[key] = new Set();
        subscribers[key].add(callback);
        return () => { subscribers[key].delete(callback); };
    },
});