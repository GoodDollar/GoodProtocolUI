import { FC } from "react";
import { IAnalyticsConfig } from "./sdk";
import { IAbstractProvider, IAnalyticsProvider, IAppProps, IMonitoringProvider } from "./types";
export interface IAnalyticsContext extends Pick<IAbstractProvider, "identify">, IAnalyticsProvider, IMonitoringProvider {
}
export interface IAnaliticsProviderProps {
    config: IAnalyticsConfig;
    appProps: IAppProps;
}
export declare const AnalyticsContext: import("react").Context<IAnalyticsContext>;
export declare const AnalyticsProvider: FC<IAnaliticsProviderProps>;
export declare const useAnalytics: () => IAnalyticsContext;
export declare const useSendAnalytics: () => IAnalyticsContext["send"];
//# sourceMappingURL=react.d.ts.map