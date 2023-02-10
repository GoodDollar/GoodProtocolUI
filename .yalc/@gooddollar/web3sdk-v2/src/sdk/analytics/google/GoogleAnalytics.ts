import { omit, clone, defaults } from "lodash";

import { IAbstractProvider, IAnalyticsProvider, IAppProps } from "../types";
import { getUserProps } from "../utils";
import apiFactory from "./api";
import { IGoogleConfig, defaultConfig, IGoogleAPI } from "./types";

export class GoogleAnalytics implements IAbstractProvider, IAnalyticsProvider {
  private api: IGoogleAPI | null;

  constructor(config: IGoogleConfig) {
    const mergedCfg = defaults(clone(config), defaultConfig);

    this.api = apiFactory(mergedCfg);
  }

  async initialize(appProps: IAppProps): Promise<boolean> {
    const { api } = this;
    const initialized = !!api;

    if (initialized) {
      api.setDefaultEventParams(omit(appProps, "$once"));
    }

    return initialized;
  }

  identify(identifier: string | number, email?: string, props?: object): void {
    const { api } = this;
    const { id, extra } = getUserProps(identifier, email, props);

    if (!api) {
      throw new Error('GoogleAnalytics not initialized!');
    }

    api.setUserId(id);
    api.setUserProperties(extra);
  }

  send(event: string, data?: object): void {
    const { api } = this;

    if (!api) {
      throw new Error('GoogleAnalytics not initialized!');
    }
    
    api.logEvent(event, data);
  }
}
