import { IGoogleAPI, IGoogleConfig } from "./types";

const { dataLayer } = <any>window

interface IAbstractDataModel {
  set<T = any>(prop: string, value: T): void;
  get<T = any>(prop: string): T | null;
  reset(): void;
}

class DataLayer implements IGoogleAPI {
  constructor(
    private userProperty: string
  ) {}

  setDefaultEventParams(params: object = {}): void {
    if ('event' in params) {
      throw new Error('Attempt to send event through setDefaultEventParams(). Use logEvent() instead');
    }

    this.push(params)
  }

  setUserId(id: string): void {
    this.setUserProperties({ id })
  }

  // merges user data between calls
  setUserProperties(props: Record<string, any> = {}): void {
    const self = this
    const { userProperty } = self

    dataLayer.push(function(this: IAbstractDataModel) {
      const user = this.get(userProperty) || {}
      const newProps = { ...user, ...props }

      this.set(userProperty, newProps)
      self.push({ [userProperty]: newProps })
    });
  }

  logEvent(event: string, data: any = {}): void {
    this.push({ event, ...data })
  }

  private push(params: object): void {
    dataLayer.push(params)
  }
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const GoogleAPIFactory = (config: IGoogleConfig) => !dataLayer ? null : new DataLayer(config.userProperty!);

export default GoogleAPIFactory;
