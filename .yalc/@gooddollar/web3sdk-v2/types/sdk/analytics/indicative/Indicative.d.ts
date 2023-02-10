import { IAbstractProvider, IAnalyticsProvider, IAppProps } from "../types";
import { IIndicativeConfig } from "./types";
export declare class Indicative implements IAbstractProvider, IAnalyticsProvider {
    private config;
    constructor(config: IIndicativeConfig);
    initialize(appProps: IAppProps): Promise<boolean>;
    identify(identifier: string | number, email?: string, props?: object): void;
    send(event: string, data?: object): void;
}
//# sourceMappingURL=Indicative.d.ts.map