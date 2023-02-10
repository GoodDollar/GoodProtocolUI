import analytics from '@react-native-firebase/analytics'
import { IGoogleAPI, IGoogleConfig } from './types'

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
const GoogleAPIFactory = (_: IGoogleConfig): IGoogleAPI => <any>analytics as IGoogleAPI;

export default GoogleAPIFactory;
