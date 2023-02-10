import {
  IAbstractConfig,
  IAbstractProvider,
  IAnalyticsProvider,
  IAppProps,
  IMonitoringProvider,
  IProvider,
  ProviderType
} from "./types";
import { supportsAnalytics, supportsMonitoring } from "./utils";
import { Amplitude, IAmplitudeConfig } from "./amplitude";
import { GoogleAnalytics, IGoogleConfig } from "./google";
import { Sentry, ISentryConfig } from "./sentry";
import { IIndicativeConfig, Indicative } from "./indicative";

export interface IAnalyticsConfig {
  [ProviderType.Amplitude]?: IAmplitudeConfig;
  [ProviderType.GoogleAnalytics]?: IGoogleConfig;
  [ProviderType.Indicative]?: IIndicativeConfig;
  [ProviderType.Sentry]?: ISentryConfig;
}

type ProviderFactories = {
  [key in ProviderType]: new (config: IAbstractConfig) => IProvider;
};

export class Analytics implements IAbstractProvider, IAnalyticsProvider, IMonitoringProvider {
  static readonly factories: ProviderFactories = {
    [ProviderType.Amplitude]: Amplitude,
    [ProviderType.GoogleAnalytics]: GoogleAnalytics,
    [ProviderType.Indicative]: Indicative,
    [ProviderType.Sentry]: Sentry
  };

  private providers: IProvider[] = [];
  private initialized = false;

  constructor(private config: IAnalyticsConfig) {}

  async initialize(appProps: IAppProps): Promise<boolean> {
    const factories = Object.entries(Analytics.factories);

    if (this.initialized) {
      return true;
    }

    await Promise.all(
      factories.map(async ([providerType, ProviderClass]) => {
        const config = this.config[providerType];

        if (!config || !config.enabled) {
          return;
        }

        const provider = new ProviderClass(config);        
        const initialized = await provider.initialize!(appProps); // eslint-disable-line @typescript-eslint/no-non-null-assertion 

        if (!initialized) {
          return;
        }

        this.providers.push(provider);
      })
    );

    this.initialized = true;
    return true;
  }

  identify(identifier: string | number, email?: string, props?: object): void {
    if (!this.initialized) {
      return;
    }

    for (const provider of this.providers) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      provider.identify!(identifier, email, props);
    }
  }

  send(event: string, data?: object): void {
    if (!this.initialized) {
      return;
    }

    for (const provider of this.providers) {
      if (!supportsAnalytics(provider)) {
        continue;
      }

      provider.send(event, data);
    }
  }

  capture(exception: Error, fingerprint?: string[], tags?: object, extra?: object): void {
    if (!this.initialized) {
      return;
    }

    for (const provider of this.providers) {
      if (!supportsMonitoring(provider)) {
        continue;
      }

      provider.capture(exception, fingerprint, tags, extra);
    }
  }
}
