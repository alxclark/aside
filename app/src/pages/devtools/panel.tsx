import React from 'react';
import {createRoot} from 'react-dom/client';

import {DevTools} from './DevTools';
import '../../styles/devtools.css';

const container = document.getElementById('app') as HTMLElement;
const root = createRoot(container);

root.render(<DevTools />);
