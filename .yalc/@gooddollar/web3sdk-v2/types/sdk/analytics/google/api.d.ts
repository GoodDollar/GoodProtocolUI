import { IGoogleAPI, IGoogleConfig } from "./types";
declare class DataLayer implements IGoogleAPI {
    private userProperty;
    constructor(userProperty: string);
    setDefaultEventParams(params?: object): void;
    setUserId(id: string): void;
    setUserProperties(props?: Record<string, any>): void;
    logEvent(event: string, data?: any): void;
    private push;
}
declare const GoogleAPIFactory: (config: IGoogleConfig) => DataLayer | null;
export default GoogleAPIFactory;
//# sourceMappingURL=api.d.ts.map