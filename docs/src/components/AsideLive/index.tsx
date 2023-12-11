/* eslint-disable @typescript-eslint/no-var-requires */
import BrowserOnly from '@docusaurus/BrowserOnly';

import {type Props} from './AsideLive';

export function AsideLive(props: Props) {
  return (
    <BrowserOnly>
      {() => {
        const AsideLiveCSR = require('./AsideLive').AsideLive;
        return <AsideLiveCSR {...props} />;
      }}
    </BrowserOnly>
  );
}
