import {AllComponents} from '@aside/chrome-ui';

export function prefixComponents(
  components: {[key: string]: any},
  prefix: string,
) {
  return Object.keys(components).reduce<{[key: string]: any}>((prev, key) => {
    const prefixedKey = prefix + key;

    prev[prefixedKey] = components[key];

    return prev;
  }, {});
}

export const COMPONENTS = {
  ...prefixComponents(AllComponents, 'ChromeUI'),
};
