import style from './App.module.scss'
import { Timer } from './Timer/Timer'
function App() {
  return (
    <div className={style.container}>
      <Timer />
    </div>
  )
}

export default App
