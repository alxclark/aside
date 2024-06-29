import React from 'react';
import {createRoot} from 'react-dom/client';

const container = document.getElementById('app') as HTMLElement;
const root = createRoot(container);

root.render(
  <div>
    <p>hello</p>
  </div>,
);
