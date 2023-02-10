declare const __DEV__: boolean;

declare global {
  interface Window {
    __aside: {
      log(...message: any[]): void;
    };
  }
}

export {};
