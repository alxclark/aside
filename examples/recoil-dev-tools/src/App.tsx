import React from 'react';
import {DevTools} from '@aside/recoil';
import {
  RecoilRoot,
  atom,
  useRecoilState,
  selector,
  useRecoilValue,
  atomFamily,
} from 'recoil';

export function App() {
  return (
    <RecoilRoot key="recoil-example">
      <RecoilApp />
      <DevTools />
    </RecoilRoot>
  );
}

export function RecoilApp() {
  const [count, setCount] = useRecoilState(countAtom);
  const countTen = useRecoilValue(countTimesTenAtom);
  const string = useRecoilValue(stringAtom);
  const object = useRecoilValue(objectAtom);
  const family = useRecoilValue(familyAtom('1'));
  const family2 = useRecoilValue(familyAtom('2'));
  const [random, setRandom] = useRecoilState(randomAtom);

  function randomize() {
    switch (typeof random) {
      case 'number':
        setRandom('ninety-nine');
        break;
      case 'string':
        setRandom({ninety: {nine: 9}});
        break;
      case 'object':
        setRandom(() => () => 99);
        break;
      case 'function':
        setRandom(true);
        break;
      case 'boolean':
        setRandom(undefined);
        break;
      case 'undefined':
        setRandom(null);
        break;
    }
  }

  return (
    <div className="App">
      <h1>Vite + React</h1>
      <button onClick={() => randomize()}>Randomize</button>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        {countTen}
        {string}
        {object.something.nested}
        {family?.id}
        {family2?.id}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

const countAtom = atom({
  default: 0,
  key: 'count',
});

const randomAtom = atom<any>({
  key: 'random',
  default: 99,
});

const countTimesTenAtom = selector({
  key: 'count10',
  get: ({get}) => get(countAtom) * 10,
});

const stringAtom = atom({
  default: 'hello',
  key: 'other',
});

const objectAtom = atom({
  default: {
    something: {
      nested: 3,
    },
  },
  key: 'object',
});

const familyAtom = atomFamily<{id: number} | null, string>({
  default: null,
  key: 'family',
});
