import { get, omit, forOwn } from 'lodash'

import { IAbstractProvider, IAppProps, IMonitoringProvider } from '../types'
import { getUserProps } from '../utils';
import api from './api'
import { ISentryConfig } from './types'

export class Sentry implements IAbstractProvider, IMonitoringProvider {
  constructor(
    private config: ISentryConfig
  ) {}

  async initialize(appProps: IAppProps): Promise<boolean> {
    const { sentryDSN } = this.config;
    const { env, version, ...tags } = omit(appProps, 'osVersion', '$once')
    const sentryScope = { appVersion: version, ...tags }

    if (!sentryDSN) {
      return false;
    }

    api.init({
      dsn: sentryDSN,
      environment: env,
    })


    api.configureScope((scope: any) =>
      forOwn(sentryScope, (value: string, property: string) =>
        scope.setTag(property, value))
    );

    return true;
  }

  identify(identifier: string | number, email?: string, props?: object): void {
    const { id, extra } = getUserProps(identifier, email, props);

    api.configureScope((scope: any) => {
      const user = get(scope, '_user', {})

      scope.setUser({ ...user, id, email, ...extra })
    })
  }

  capture(exception: Error, fingerprint?: string[], tags?: object, extra?: object): void {
    api.configureScope((scope: any) => {
      // set extra
      forOwn(extra || {}, (value: any, key: string) => scope.setExtra(key, value))

      // set tags
      forOwn(tags || {}, (value: any, key: string) => scope.setTag(key, value))

      if (fingerprint) {
        scope.setFingerprint(fingerprint)
      }

      api.captureException(exception)
    })
  }
}
