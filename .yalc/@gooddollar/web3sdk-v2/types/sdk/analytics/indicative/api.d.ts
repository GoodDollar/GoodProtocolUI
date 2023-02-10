import { IIndicativeApi } from "./types";
declare class IndicativeAPIWeb implements IIndicativeApi {
    private api;
    initialize(apiKey: string): Promise<boolean>;
    addProperties(props: object): void;
    setUniqueID(id: string): void;
    buildEvent(eventName: string, props?: object): void;
}
export declare const IndicativeAPIWebSdk: typeof IndicativeAPIWeb | null;
export {};
//# sourceMappingURL=api.d.ts.map