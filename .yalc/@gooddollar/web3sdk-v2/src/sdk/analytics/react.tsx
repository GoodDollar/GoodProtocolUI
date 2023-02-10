import { createContext, FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import { noop } from "lodash";
import { Analytics, IAnalyticsConfig } from "./sdk";
import { IAbstractProvider, IAnalyticsProvider, IAppProps, IMonitoringProvider, IProvider } from "./types";

export interface IAnalyticsContext
  extends Pick<IAbstractProvider, "identify">,
    IAnalyticsProvider,
    IMonitoringProvider {}

export interface IAnaliticsProviderProps {
  config: IAnalyticsConfig;
  appProps: IAppProps;
}

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

export const AnalyticsContext = createContext<IAnalyticsContext>({
  identify: (identifier: string | number, email?: string, props?: object): void => {},
  send: (event: string, data?: object): void => {},
  capture: (exception: Error, fingerprint?: string[], tags?: object, extra?: object): void => {}
});

/* eslint-enable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

export const AnalyticsProvider: FC<IAnaliticsProviderProps> = ({ config, appProps, children }) => {
  const [sdk, setSDK] = useState<IProvider | null>(null);
  const configRef = useRef(config);
  const appPropsRef = useRef(appProps);

  const send = useCallback(
    (event: string, data?: object): void => {
      sdk?.send?.(event, data);
    },
    [sdk]
  );

  const capture = useCallback(
    (exception: Error, fingerprint?: string[], tags?: object, extra?: object): void => {
      sdk?.capture?.(exception, fingerprint, tags, extra);
    },
    [sdk]
  );

  const identify = useCallback(
    (identifier: string | number, email?: string, props?: object): void => {
      sdk?.identify?.(identifier, email, props);
    },
    [sdk]
  );

  useEffect(() => {
    const sdk = new Analytics(configRef.current);
    
    sdk.initialize(appPropsRef.current).then(() => setSDK(sdk)).catch(noop);
  }, [setSDK]);

  return !sdk ? null : (
    <AnalyticsContext.Provider value={{ send, capture, identify }}>{children}</AnalyticsContext.Provider>
  );
};

export const useAnalytics = (): IAnalyticsContext => useContext(AnalyticsContext);

export const useSendAnalytics = (): IAnalyticsContext["send"] => {
  const { send } = useAnalytics(); // eslint-disable-line @typescript-eslint/unbound-method

  return send;
}
