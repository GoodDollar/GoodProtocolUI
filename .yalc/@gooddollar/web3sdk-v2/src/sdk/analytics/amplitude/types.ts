import { IAbstractConfig } from "../types";

export interface IAmplitudeConfig extends IAbstractConfig {
  apiKey?: string;
  errorEvent?: string;
}
