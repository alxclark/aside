export interface ExtensionApi {
  storage: {
    local: {
      get(
        keys?: string | {[key: string]: any} | string[] | null | undefined,
      ): Promise<{[key: string]: any}>;
      set(items: {[key: string]: any}): Promise<void>;
    };
  };
}
