export {};

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      [key: string]: object | undefined;
    }
  }
}
