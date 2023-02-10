export declare class StorageSDK {
    private readonly api;
    getAllKeys(): Promise<readonly string[]>;
    removeItem(key: string): Promise<void>;
    mergeItem<T = any>(key: string, value: T): Promise<void>;
    multiRemove(keys: string[]): Promise<void>;
    multiMerge<T = any>(keyValuePairs: [string, T][]): Promise<void>;
    clear(): Promise<void>;
    flushGetRequests(): void;
    safeSet<T = any>(key: string, value: T, onError?: (e: Error) => void): void;
    safeRemove(key: string, onError?: (e: Error) => void): void;
    setItem<T = any>(key: string, value: T): Promise<void>;
    getItem<T = any>(key: string): Promise<T>;
    multiSet<T = any>(keyValuePairs: [string, T][]): Promise<void>;
    multiGet<T = any>(keys: readonly string[]): Promise<T>;
}
export declare const AsyncStorage: StorageSDK;
//# sourceMappingURL=sdk.d.ts.map