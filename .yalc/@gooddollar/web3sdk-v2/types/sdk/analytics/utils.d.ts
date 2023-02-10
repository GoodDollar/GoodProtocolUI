import { IAnalyticsProvider, IMonitoringProvider, IProvider, IUserProps } from "./types";
export declare function supportsAnalytics(provider: IProvider): provider is IAnalyticsProvider;
export declare function supportsMonitoring(provider: IProvider): provider is IMonitoringProvider;
export declare function getUserProps(identifier: string | number, email?: string, props?: object): IUserProps;
//# sourceMappingURL=utils.d.ts.map