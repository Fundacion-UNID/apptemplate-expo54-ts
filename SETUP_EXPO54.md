# Expo SDK 54 (JavaScript) — Project Setup & Package Guide

This guide explains how to bootstrap a clean **Expo SDK 54** project using **JavaScript**, install core packages, optional add-ons, and configure **Jest** testing.

---

## 🧭 0. Requirements

- Node ≥ 18 (LTS)
- npm ≥ 9
- Expo CLI (installed automatically via `npx`)

---

## 🧩 0.5. Project-specific notes (this repo)

- This app uses local workspace packages via `file:` deps: `../gdc-sdk-client-ts` and `../gdc-common-utils-ts`.
- Run `npm i` in both local packages (or set up workspaces) so their dependencies are installed.
- Crypto/encoding libs like `base-x`, `@noble/*`, `@stablelib/*`, and `pako` live in `gdc-common-utils-ts`.
- UI helpers already listed in this app’s `package.json` include `react-native-country-codes-picker`, `react-native-country-flag`, `react-native-gifted-chat`, and `react-i18next`. You only need `npm i` here, not repeated `expo install`.
- To avoid Metro missing local package dependencies, use:
  - `npm run install:local-deps` (reads local `file:` packages and installs their deps in this app)
  - `npm run uninstall:local-deps` (removes only the deps installed by the script)

---

## 🚀 1. Create a new project

```bash
npx create-expo-app@latest my-app --template blank
cd my-app
```
When prompted:
- **SDK** → latest (SDK 54)
- **Language** → **JavaScript**

Verify version:
```bash
npx expo --version
```
`package.json` should include:
```json
"expo": "~54.x.x"
```

---

## ⚙️ 2. Core & Navigation

```bash
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs @react-navigation/elements
npx expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context
```

### ✏️ Babel config (must include Reanimated plugin last)

`babel.config.js`
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

### 📦 Babel preset & core (required if missing)

Fixes “Cannot find module `babel-preset-expo`” or bundling errors:

```bash
npm i -D babel-preset-expo @babel/core
# or
yarn add -D babel-preset-expo @babel/core
```

### 👋 Gesture Handler import

At the very top of `App.js`:
```js
import 'react-native-gesture-handler';
```

---

## 🎨 3. Expo & UI Libraries

```bash
npx expo install expo-status-bar expo-font expo-asset expo-constants expo-checkbox expo-document-picker
npx expo install @expo/vector-icons react-native-paper react-native-elements
```

---

## 🎛️ 4. Pickers / Sliders / Checkboxes

```bash
npx expo install @react-native-community/slider @react-native-picker/picker
```

Note: if you prefer Expo’s checkbox component, use `expo-checkbox` (already included in section 3) instead of `@react-native-community/checkbox`.

---

## 📡 5. Storage & Connectivity

```bash
npx expo install @react-native-async-storage/async-storage @react-native-community/netinfo
```

---

## 🔐 6. Crypto / UUID / Encoding

Native support (Expo-managed):

```bash
npx expo install react-native-get-random-values expo-crypto
```

JS-only packages (clean app):

```bash
npm i uuid base-x pako @noble/hashes @noble/post-quantum @stablelib/utf8 @stablelib/base64
```

In this repo, these live under `../gdc-common-utils-ts/package.json`. Only install them in the app if you import them directly from the app code.

If you use `uuid` in React Native, ensure you import the polyfill once (e.g. in `index.js`):

```js
import 'react-native-get-random-values';
```

---

## 🌐 7. i18n

```bash
npm i i18next react-i18next
```

This repo already uses `i18next` via `utils/i18n.js` and `react-i18next` across the UI.

---

## 🍎 8. Auth Session / Apple Sign In / Browser

```bash
npx expo install expo-auth-session expo-web-browser expo-apple-authentication
```

---

## 📱 9. Device / Network / Filesystem

```bash
npx expo install expo-device expo-network expo-file-system
```

---

## 🔔 10. Notifications

```bash
npx expo install expo-notifications
```

---

## 🗃️ 11. SQLite

```bash
npx expo install expo-sqlite
```

---

## 🔥 12. Firebase

### Option A (recommended in Expo managed workflow): Web SDK

```bash
npm i firebase
```

Note: This app also uses `@react-native-firebase/*` for native. Metro requires `firebase`
to be installed at the app root (even if it is a transitive dependency), or web bundling
will fail resolving `@firebase/auth`.

### Option B (native): `@react-native-firebase/auth` (requires custom dev client / EAS build)

Expo Go does not include React Native Firebase native modules. If you choose this route, you typically need:

```bash
npm i @react-native-firebase/app @react-native-firebase/auth
```

---

## 🧭 13. React Navigation (Stack)

If you need the JS-based stack navigator in addition to `native-stack`:

```bash
npx expo install @react-navigation/stack
```

---

## 🗺️ 14. Country & Flags

```bash
npm i react-native-country-codes-picker react-native-country-flag country-flag-icons
npx expo install react-native-svg
```

Notes:
- `country-flag-icons` is mainly useful for web.
- This repo already uses `react-native-country-codes-picker` and `react-native-country-flag` in `components/CountrySelector.js`.

### Option A — Simple built-in picker (no external deps)

---

## 💬 15. UI Helpers (JS-only)

```bash
npm i react-native-collapsible react-native-gifted-chat
```

This repo already uses `react-native-gifted-chat` in `screens/communications/ChatScreen.js`.

---

## 🌍 16. Web-only helpers (Expo Web)

```bash
npm i idb
```

---

## 🧾 17. TypeScript-only helpers (optional)

If you also keep TS tooling around (even in a JS app):

```bash
npm i -D json-schema-to-ts
```

---

## 🧩 18. Native UI Helpers (may require custom dev client)

These packages include native code and may not work in Expo Go:

```bash
npm i react-native-keyboard-controller react-native-worklets
```

---

## 🧹 19. Clean install & start

```bash
rm -rf node_modules package-lock.json
npm i
npx expo start -c
```

---

## 🧪 20. Add Jest Testing (JavaScript)

Expo’s blank JS template doesn’t include Jest. For SDK 54 with React 19.1.0, pin the matching renderer.

```bash
npm i -D jest-expo@^54.0.0 jest@^29.7.0   react-test-renderer@19.1.0   @testing-library/react-native@13.3.3 @testing-library/jest-native@5.2.0
```

`package.json` additions:
```json
"scripts": {
  "start": "expo start",
  "test": "jest",
  "lint": "expo lint"
},
"jest": {
  "preset": "jest-expo",
  "setupFilesAfterEnv": ["@testing-library/jest-native/extend-expect"],
  "testMatch": ["**/__tests__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)"]
}
```

Sample test: `__tests__/App.test.js`
```js
import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  it('renders hello message', () => {
    const { getByText } = render(<App />);
    expect(getByText('Hello Expo 54!')).toBeTruthy();
  });
});
```

Run:
```bash
npm test
```
If npm warns about peers, re-run install with:
```bash
npm i -D --legacy-peer-deps
```

---

## 🩹 21. Common Fixes

| Problem | Fix |
|--------|-----|
| Reanimated not working | Ensure Babel plugin is last, then `npx expo start -c`. |
| “Cannot find babel-preset-expo” | `npm i -D babel-preset-expo @babel/core`. |
| Jest peer conflict | Pin `react-test-renderer` to match React (e.g., `19.1.0`). |

---

## 🧰 22. Suggested Scripts

```json
"scripts": {
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "lint": "expo lint",
  "test": "jest",
  "clean": "rm -rf node_modules package-lock.json && npm i"
}
```

---

## ✅ 23. Pre-commit Checklist

- [ ] `babel.config.js` includes `react-native-reanimated/plugin`
- [ ] `App.js` starts with `import 'react-native-gesture-handler';`
- [ ] `@react-native-picker/picker` installed
- [ ] Country picker optional deps installed (if used)
- [ ] `npm test` passes
