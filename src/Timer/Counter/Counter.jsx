import { useEffect, useState, useRef } from 'react'
import style from './Counter.module.scss'

export function Counter({
  timerStart,
  timerReset,
  setTimerReset,
  activeTimer,
  optionTimerTomato,
  setTimerStart,
  // reset,
}) {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  let timeMsec = useRef({ start: 0, now: 0 })
  let differentMsec = useRef(0)

  let timeTomatoMsec = useRef({
    totalWork: optionTimerTomato.work * 60 * 1000,
    totalBreak: optionTimerTomato.break * 60 * 1000,
    end: 0,
    now: 0,
    work: true,
    break: false,
  })
  useEffect(() => {
    if (activeTimer === 'timer') {
    } else if (activeTimer === 'timerTomato') {
      // reset()
      setTimerReset(true)
      // setTimerStart(false)
    }
  }, [activeTimer])

  useEffect(() => {
    let interval
    if (activeTimer === 'timer') {
      if (timerStart) {
        if (timeMsec.current.start === 0) {
          timeMsec.current.start = Date.now()
        } else {
          timeMsec.current.start = Date.now() - differentMsec.current
        }

        interval = setInterval(() => {
          timeMsec.current.now = Date.now()

          getTimeRemaining()
        }, 1000)
      } else {
        clearInterval(interval)
      }
    } else if (activeTimer === 'timerTomato') {
      // setTime((prev) => ({ ...prev, minutes: optionTimerTomato.work }))
      if (timerStart) {
        if (timeTomatoMsec.current.work) {
          timeTomatoMsec.current.end =
            Date.now() + timeTomatoMsec.current.totalWork

          interval = setInterval(() => {
            getTimeRemainingTomato()
            console.log(differentMsec.current)
            if (differentMsec.current < 1000 && differentMsec.current !== 0) {
              clearInterval(interval)

              timeTomatoMsec.current = {
                ...timeTomatoMsec.current,
                work: false,
                break: true,
              }

              differentMsec.current = 0
            }
          }, 1000)
        } else if (timeTomatoMsec.current.break) {
          timeTomatoMsec.current.end =
            Date.now() + timeTomatoMsec.current.totalBreak
          interval = setInterval(() => {
            getTimeRemainingTomato()
            if (differentMsec.current < 1000 && differentMsec.current !== 0) {
              clearInterval(interval)

              timeTomatoMsec.current = {
                ...timeTomatoMsec.current,
                work: true,
                break: false,
              }
              differentMsec.current = 0
            }
          }, 1000)
        }
      } else if (!timerStart) {
        clearInterval(interval)
      }
    }

    return () => clearInterval(interval)
  }, [
    timerStart,
    activeTimer,
    timeTomatoMsec.current.work,
    timeTomatoMsec.current.break,
  ])

  useEffect(() => {
    if (timerReset) {
      timeMsec.current = { start: 0, now: 0 }
      // differentMsec.current = 0
      setTime({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      })
      setTimerReset(false)
    }
  }, [timerReset])

  const getTimeRemainingTomato = () => {
    const different = timeTomatoMsec.current.end - Date.now()
    differentMsec.current = different
    const minutes = Math.floor(different / 60 / 1000)
    const seconds = Math.floor((different - minutes * 60 * 1000) / 1000)
    setTime((prev) => ({ ...prev, minutes, seconds }))
  }
  const getTimeRemaining = () => {
    const different = timeMsec.current.now - timeMsec.current.start
    differentMsec.current = different
    const seconds = Math.floor((different / 1000) % 60)
    const minutes = Math.floor((different / 1000 / 60) % 60)
    const hours = Math.floor((different / 1000 / 60 / 60) % 24)
    const days = Math.floor(different / 1000 / 60 / 60 / 24)
    setTime({ days, hours, minutes, seconds })
  }

  return (
    <div className={style.container}>
      {time.days !== 0 && (
        <div>
          <div>{time.days}</div>
          <div>Day</div>
        </div>
      )}
      {time.hours !== 0 && (
        <div>
          <div>{time.hours}</div>
          <div>Hours</div>
        </div>
      )}

      {time.minutes !== 0 && (
        <div>
          <div>{time.minutes}</div>
          <div>Min</div>
        </div>
      )}

      <div>
        <div>{time.seconds}</div>
        <div>Sec</div>
      </div>
    </div>
  )
}
