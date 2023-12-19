import React from 'react';
import {useSignalValue} from 'signals-react-safe';

import preactLogo from './assets/preact.png';
import asideLogo from './assets/aside.svg';
import './App.css';

import {counter, counterSquared} from './signals';
import {Devtools} from './Devtools';

function App() {
  const counterValue = useSignalValue(counter);
  const counterSquaredValue = useSignalValue(counterSquared);

  return (
    <>
      <div>
        <a href="https://preactjs.com/guide/v10/signals/" target="_blank">
          <img src={preactLogo} className="logo" alt="Preact logo" />
        </a>
        <a href="https://aside.dev" target="_blank">
          <img src={asideLogo} className="logo aside" alt="Aside logo" />
        </a>
      </div>
      <h1>Signals + Aside</h1>
      <div className="card">
        <button onClick={() => counter.value++}>
          count is {counterValue} (Squared is {counterSquaredValue})
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Devtools />
    </>
  );
}

export default App;
