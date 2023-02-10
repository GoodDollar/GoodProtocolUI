import { IAbstractConfig } from "../types";

export interface ISentryConfig extends IAbstractConfig {
  sentryDSN?: string;
}
