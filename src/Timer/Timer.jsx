import style from './Timer.module.scss'
import { Counter } from './Counter/Counter'
import { useState, useEffect } from 'react'
// import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Slider from '@mui/material/Slider'

const music = [
  '/Timer/audio/1.mp3',
  '/Timer/audio/2.mp3',
  '/Timer/audio/3.mp3',
  '/Timer/audio/4.mp3',
  '/Timer/audio/5.mp3',
  '/Timer/audio/6.mp3',
  '/Timer/audio/7.mp3',
  '/Timer/audio/8.mp3',
  '/Timer/audio/9.mp3',
  '/Timer/audio/10.mp3',
]

export function Timer() {
  const [timerStart, setTimerStart] = useState(false)
  const [timerReset, setTimerReset] = useState(false)
  const [activeTimer, setActiveTimer] = useState('timer')
  const [optionTimerTomato, setOptionTimerTomato] = useState({
    work: 25,
    break: 5,
    save: false,
  })

  const [randomNumber, setRandomNumber] = useState(0)
  const [firstClickStart, setFirstClickStart] = useState(true)
  const [audio] = useState(new Audio(music[randomNumber]))
  const playMusic = () => {
    audio.src = music[randomNumber]
    audio.play()
  }
  useEffect(() => {
    audio.volume = 0.1
  }, [])
  const [value, setValue] = useState(10)
  const handleChangeValue = (event, newValue) => {
    setValue(newValue)
    audio.volume = newValue / 100
  }

  const [valueActive, setValueActive] = useState(false)
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
          {activeTimer === 'timerTomato' && (
            <div
              className={style.value}
              onMouseEnter={() => {
                setValueActive(true)
              }}
              onMouseLeave={() => {
                setValueActive(false)
              }}
            >
              <img onClick={() => {}} src='/Timer/value.png' alt='' />
              {valueActive && (
                <Stack
                  className={style.valueSlider}
                  spacing={2}
                  direction='row'
                  alignItems='center'
                >
                  <Slider
                    defaultValue={value}
                    aria-label='Volume'
                    value={value}
                    onChange={handleChangeValue}
                    color='#f7fffe'
                  />
                </Stack>
              )}
            </div>
          )}
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
              // audio={audio}
              setRandomNumber={setRandomNumber}
              music={music}
              playMusic={playMusic}
              setFirstClickStart={setFirstClickStart}

              // setTimerStart={setTimerStart}
              // reset={reset}
            />
            <div className={style.buttons}>
              <button
                onClick={() => {
                  setTimerStart((current) => !current)
                  if (
                    activeTimer === 'timerTomato' &&
                    firstClickStart === true
                  ) {
                    audio.play()
                    audio.pause()
                    setFirstClickStart(false)
                  }
                }}
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
                  min={1}
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
                  min={1}
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
                if (optionTimerTomato.work > 0 && optionTimerTomato.break > 0) {
                  setOptionTimerTomato((prev) => ({
                    ...prev,
                    save: true,
                  }))
                } else {
                  alert('Значения не могут быть отрицательными числами и 0')
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
