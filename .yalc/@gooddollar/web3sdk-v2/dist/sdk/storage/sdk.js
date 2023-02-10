"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncStorage = exports.StorageSDK = void 0;
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const lodash_1 = require("lodash");
const utils_1 = require("./utils");
const utils_2 = require("../base/utils");
class StorageSDK {
    constructor() {
        this.api = async_storage_1.default;
    }
    async getAllKeys() {
        return this.api.getAllKeys();
    }
    async removeItem(key) {
        await this.api.removeItem(key);
    }
    async mergeItem(key, value) {
        const stringified = JSON.stringify(value);
        await this.api.mergeItem(key, stringified);
    }
    async multiRemove(keys) {
        await this.api.multiRemove(keys);
    }
    async multiMerge(keyValuePairs) {
        const stringifiedPairs = (0, utils_1.stringifyPairs)(keyValuePairs);
        if (stringifiedPairs) {
            await this.api.multiMerge(stringifiedPairs);
        }
    }
    async clear() {
        await this.api.clear();
    }
    flushGetRequests() {
        this.api.flushGetRequests();
    }
    safeSet(key, value, onError) {
        this.setItem(key, value).catch(onError || lodash_1.noop);
    }
    safeRemove(key, onError) {
        this.api.removeItem(key).catch(onError || lodash_1.noop);
    }
    async setItem(key, value) {
        const stringified = JSON.stringify(value);
        await this.api.setItem(key, stringified);
    }
    async getItem(key) {
        const jsonValue = await this.api.getItem(key);
        return (0, utils_2.tryJson)(jsonValue !== null && jsonValue !== void 0 ? jsonValue : "");
    }
    async multiSet(keyValuePairs) {
        const stringifiedPairs = (0, utils_1.stringifyPairs)(keyValuePairs);
        if (stringifiedPairs) {
            await this.api.multiSet(stringifiedPairs);
        }
    }
    async multiGet(keys) {
        const keyJsonValuePairs = await this.api.multiGet(keys);
        return keyJsonValuePairs.map(([key, jsonValue]) => [key, (0, utils_2.tryJson)(jsonValue !== null && jsonValue !== void 0 ? jsonValue : "")]);
    }
}
exports.StorageSDK = StorageSDK;
exports.AsyncStorage = new StorageSDK();
//# sourceMappingURL=sdk.js.map