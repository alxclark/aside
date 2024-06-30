import React from 'react';
import {createRoot} from 'react-dom/client';
import {Host} from './components/Host/Host';

const container = document.getElementById('app');

if (!container) {
  throw new Error('Could not find a container to mount the application');
}

const root = createRoot(container);

root.render(<Host />);
