import React from 'react';
import ReactDOM from 'react-dom';

import {DevTools} from './DevTools';
import '../../styles/devtools.css'

ReactDOM.render(<DevTools />, document.getElementById('app') as HTMLElement);
