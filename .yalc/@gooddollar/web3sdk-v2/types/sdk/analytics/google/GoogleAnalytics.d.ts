import { IAbstractProvider, IAnalyticsProvider, IAppProps } from "../types";
import { IGoogleConfig } from "./types";
export declare class GoogleAnalytics implements IAbstractProvider, IAnalyticsProvider {
    private api;
    constructor(config: IGoogleConfig);
    initialize(appProps: IAppProps): Promise<boolean>;
    identify(identifier: string | number, email?: string, props?: object): void;
    send(event: string, data?: object): void;
}
//# sourceMappingURL=GoogleAnalytics.d.ts.map