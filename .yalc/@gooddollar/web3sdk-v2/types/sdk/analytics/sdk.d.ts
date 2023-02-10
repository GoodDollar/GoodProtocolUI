import { IAbstractConfig, IAbstractProvider, IAnalyticsProvider, IAppProps, IMonitoringProvider, IProvider, ProviderType } from "./types";
import { IAmplitudeConfig } from "./amplitude";
import { IGoogleConfig } from "./google";
import { ISentryConfig } from "./sentry";
import { IIndicativeConfig } from "./indicative";
export interface IAnalyticsConfig {
    [ProviderType.Amplitude]?: IAmplitudeConfig;
    [ProviderType.GoogleAnalytics]?: IGoogleConfig;
    [ProviderType.Indicative]?: IIndicativeConfig;
    [ProviderType.Sentry]?: ISentryConfig;
}
type ProviderFactories = {
    [key in ProviderType]: new (config: IAbstractConfig) => IProvider;
};
export declare class Analytics implements IAbstractProvider, IAnalyticsProvider, IMonitoringProvider {
    private config;
    static readonly factories: ProviderFactories;
    private providers;
    private initialized;
    constructor(config: IAnalyticsConfig);
    initialize(appProps: IAppProps): Promise<boolean>;
    identify(identifier: string | number, email?: string, props?: object): void;
    send(event: string, data?: object): void;
    capture(exception: Error, fingerprint?: string[], tags?: object, extra?: object): void;
}
export {};
//# sourceMappingURL=sdk.d.ts.map