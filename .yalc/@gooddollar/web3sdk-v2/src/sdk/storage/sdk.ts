import { default as AsyncStorageRN } from "@react-native-async-storage/async-storage";
import { noop } from "lodash";

import { stringifyPairs } from "./utils";
import { tryJson } from "../base/utils";

export class StorageSDK {
  private readonly api: typeof AsyncStorageRN = AsyncStorageRN;

  async getAllKeys(): Promise<readonly string[]> {
    return this.api.getAllKeys();
  }

  async removeItem(key: string): Promise<void> {
    await this.api.removeItem(key);
  }

  async mergeItem<T = any>(key: string, value: T): Promise<void> {
    const stringified = JSON.stringify(value);

    await this.api.mergeItem(key, stringified);
  }

  async multiRemove(keys: string[]): Promise<void> {
    await this.api.multiRemove(keys);
  }

  async multiMerge<T = any>(keyValuePairs: [string, T][]): Promise<void> {
    const stringifiedPairs = stringifyPairs(keyValuePairs);

    if (stringifiedPairs) {
      await this.api.multiMerge(stringifiedPairs);
    }
  }

  async clear(): Promise<void> {
    await this.api.clear();
  }

  flushGetRequests(): void {
    this.api.flushGetRequests();
  }

  safeSet<T = any>(key: string, value: T, onError?: (e: Error) => void): void {
    this.setItem(key, value).catch(onError || noop);
  }

  safeRemove(key: string, onError?: (e: Error) => void): void {
    this.api.removeItem(key).catch(onError || noop);
  }

  async setItem<T = any>(key: string, value: T): Promise<void> {
    const stringified = JSON.stringify(value);

    await this.api.setItem(key, stringified);
  }

  async getItem<T = any>(key: string): Promise<T> {
    const jsonValue = await this.api.getItem(key);

    return tryJson(jsonValue ?? "") as T;
  }

  async multiSet<T = any>(keyValuePairs: [string, T][]): Promise<void> {
    const stringifiedPairs = stringifyPairs(keyValuePairs);

    if (stringifiedPairs) {
      await this.api.multiSet(stringifiedPairs);
    }
  }

  async multiGet<T = any>(keys: readonly string[]): Promise<T> {
    const keyJsonValuePairs = await this.api.multiGet(keys);

    return keyJsonValuePairs.map(([key, jsonValue]) => [key, tryJson(jsonValue ?? "")]) as T;
  }
}

export const AsyncStorage = new StorageSDK();
