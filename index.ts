// Polyfill for setImmediate to support @react-native-firebase on web
import 'setimmediate';
import { Buffer } from 'buffer';

import { registerRootComponent } from 'expo';

import App from './App';

if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = Buffer;
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
