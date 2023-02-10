export declare enum ProviderType {
    Amplitude = "amplitude",
    GoogleAnalytics = "google",
    Indicative = "indicative",
    Sentry = "sentry"
}
export type IAppProps = Record<string, string> & {
    env: string;
    version: string;
    osVersion: string;
    $once?: Record<string, string>;
};
export interface IUserProps {
    id: string;
    extra: Record<string, any>;
}
export interface IAbstractConfig {
    enabled: boolean;
}
export interface IAbstractProvider {
    initialize(appProps: IAppProps): Promise<boolean>;
    identify(identifier: string | number, email?: string, props?: object): void;
}
export interface IAnalyticsProvider {
    send(event: string, data?: object): void;
}
export interface IMonitoringProvider {
    capture(exception: Error, fingerprint?: string[], tags?: object, extra?: object): void;
}
export interface IProvider extends Partial<IAbstractProvider>, Partial<IAnalyticsProvider>, Partial<IMonitoringProvider> {
}
//# sourceMappingURL=types.d.ts.map