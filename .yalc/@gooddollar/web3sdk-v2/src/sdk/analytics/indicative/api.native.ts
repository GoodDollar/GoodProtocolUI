import Indicative from "react-native-indicative";
import { IIndicativeApi } from "./types";

export default class IndicativeAPINative implements IIndicativeApi {
  async initialize(apiKey: string): Promise<boolean> {
    Indicative.launch(apiKey);
    return true;
  }

  addProperties(props: object): void {
    Indicative.addCommonProperties(props);
  }

  setUniqueID(id: string): void {
    Indicative.identifyUser(id);
  }

  buildEvent(eventName: string, props?: object) {
    if (props) {
      Indicative.record(eventName);
      return;
    }

    Indicative.recordWithProperties(eventName, props);
  }
}
