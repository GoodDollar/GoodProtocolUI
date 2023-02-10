import { IIndicativeApi } from "./types";
export default class IndicativeAPINative implements IIndicativeApi {
    initialize(apiKey: string): Promise<boolean>;
    addProperties(props: object): void;
    setUniqueID(id: string): void;
    buildEvent(eventName: string, props?: object): void;
}
//# sourceMappingURL=api.native.d.ts.map