import React from 'react';
import {createRoot} from 'react-dom/client';

import {Host} from './host';
import '../../styles/devtools.css';
import '@aside/chrome-ui/css';

const container = document.getElementById('app') as HTMLElement;
const root = createRoot(container);

root.render(
  <div className="aside h-full">
    <Host />
  </div>,
);
