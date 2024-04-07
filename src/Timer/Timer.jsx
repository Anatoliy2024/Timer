import style from './Timer.module.scss'
import { Counter } from './Counter/Counter'
import { useState } from 'react'
export function Timer() {
  const [timerStart, setTimerStart] = useState(false)
  const [timerReset, setTimerReset] = useState(false)
  const [activeTimer, setActiveTimer] = useState('timer')
  const [optionTimerTomato, setOptionTimerTomato] = useState({
    work: 25,
    break: 5,
    save: false,
  })

  const reset = () => {
    setTimerReset(true)
    setTimerStart(false)
  }

  const openTimer = () => {
    setActiveTimer('timer')
    setOptionTimerTomato((prev) => ({ ...prev, save: false }))
    reset()
  }

  const openTimerTomato = () => {
    if (optionTimerTomato.save === true) {
      setOptionTimerTomato((prev) => ({ ...prev, save: false }))
    }
    setActiveTimer('timerTomato')
    reset()
  }
  return (
    <div className={style.boxTimer}>
      <div className={style.container}>
        <div className={style.changeTimerImg}>
          <img
            onClick={openTimer}
            style={{
              backgroundColor:
                activeTimer === 'timer' ? 'rgba(9, 9, 121, 1)' : '',
            }}
            src='/Timer/timer.png'
            alt=''
          />
          <img
            onClick={openTimerTomato}
            style={{
              backgroundColor:
                activeTimer === 'timerTomato' ? 'rgba(9, 9, 121, 1)' : '',
            }}
            src='/Timer/tomato.png'
            alt=''
          />
        </div>
        {(activeTimer === 'timer' || optionTimerTomato.save === true) && (
          <div className={style.content}>
            <h1>Timer</h1>
            <Counter
              timerStart={timerStart}
              activeTimer={activeTimer}
              timerReset={timerReset}
              setTimerReset={setTimerReset}
              optionTimerTomato={optionTimerTomato}
              // setTimerStart={setTimerStart}
              // reset={reset}
            />
            <div className={style.buttons}>
              <button
                onClick={() => setTimerStart((current) => !current)}
                className={style.bnStart}
              >
                {timerStart ? 'Pause' : 'Start'}
              </button>
              <button onClick={reset}>Reset</button>
            </div>
          </div>
        )}
        {activeTimer === 'timerTomato' && optionTimerTomato.save === false && (
          <div className={style.content}>
            <h1>Option</h1>
            <div className={style.option}>
              <div>
                <input
                  min={0}
                  type='number'
                  id='work'
                  value={optionTimerTomato.work}
                  onChange={(e) =>
                    setOptionTimerTomato((prev) => ({
                      ...prev,
                      work: e.target.value,
                    }))
                  }
                />
                <label htmlFor='work'>Work</label>
              </div>
              <div>
                <input
                  min={0}
                  type='number'
                  id='break'
                  value={optionTimerTomato.break}
                  onChange={(e) =>
                    setOptionTimerTomato((prev) => ({
                      ...prev,
                      break: e.target.value,
                    }))
                  }
                />
                <label htmlFor='break'>Break</label>
              </div>
            </div>
            <button
              onClick={() => {
                if (
                  optionTimerTomato.work >= 0 &&
                  optionTimerTomato.break >= 0
                ) {
                  setOptionTimerTomato((prev) => ({
                    ...prev,
                    save: true,
                  }))
                } else {
                  alert('Значения не могут быть отрицательными')
                }
              }}
              className={style.btnSaveOption}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
