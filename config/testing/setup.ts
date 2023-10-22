import {destroyAll} from '@shopify/react-testing';

import {mockBrowser} from './browser';
import '@shopify/react-testing/matchers';

mockBrowser();

afterEach(() => {
  destroyAll();
});
