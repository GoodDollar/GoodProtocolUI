import { IAbstractProvider, IAnalyticsProvider, IAppProps, IMonitoringProvider } from "../types";
import { IAmplitudeConfig } from "./types";
export declare class Amplitude implements IAbstractProvider, IAnalyticsProvider, IMonitoringProvider {
    private config;
    constructor(config: IAmplitudeConfig);
    initialize(appProps: IAppProps): Promise<boolean>;
    identify(identifier: string | number, email?: string, props?: object): void;
    send(event: string, data?: object): void;
    capture(exception: Error, fingerprint?: string[], tags?: object, extra?: object): void;
    private identifyFromProps;
}
//# sourceMappingURL=Amplitude.d.ts.map