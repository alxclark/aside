declare const __DEV__: boolean;

declare global {
  interface Window {
    __companion: {
      log(...message: any[]): void;
    };
  }
}

export {};
