import {RecoilDevTools} from '@companion/recoil'
import {RecoilRoot, atom, useRecoilState, selector, useRecoilValue} from 'recoil'

export function App() {
  return (
    <RecoilRoot>
      <RecoilApp />
    </RecoilRoot>
  )
}

export function RecoilApp() {
  const [count, setCount] = useRecoilState(countAtom)
  const countTen = useRecoilValue(countTimesTenAtom);

  return (
    <div className="App">
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        {countTen}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <RecoilDevTools />
    </div>
  )
}

const countAtom = atom({
  default: 0,
  key: 'count',
})

const countTimesTenAtom = selector({
  key: 'count10',
  get: ({get}) => get(countAtom) * 10
})
