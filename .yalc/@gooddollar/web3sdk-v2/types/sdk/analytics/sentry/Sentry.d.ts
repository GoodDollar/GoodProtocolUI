import { IAbstractProvider, IAppProps, IMonitoringProvider } from '../types';
import { ISentryConfig } from './types';
export declare class Sentry implements IAbstractProvider, IMonitoringProvider {
    private config;
    constructor(config: ISentryConfig);
    initialize(appProps: IAppProps): Promise<boolean>;
    identify(identifier: string | number, email?: string, props?: object): void;
    capture(exception: Error, fingerprint?: string[], tags?: object, extra?: object): void;
}
//# sourceMappingURL=Sentry.d.ts.map