import { assign, pickBy, isFunction } from 'lodash'

import { IAnalyticsProvider, IMonitoringProvider, IProvider, IUserProps } from "./types";

export function supportsAnalytics(provider: IProvider): provider is IAnalyticsProvider {
  return 'send' in provider && isFunction(provider['send']);
}

export function supportsMonitoring(provider: IProvider): provider is IMonitoringProvider {
  return 'capture' in provider && isFunction(provider['capture']);
}

export function getUserProps(identifier: string | number, email?: string, props?: object): IUserProps {
  const id = String(identifier || email)
  const extra = assign(pickBy({ email }), props || {})

  return { id, extra }
}
