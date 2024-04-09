import { useEffect, useState, useRef } from 'react'
import style from './Counter.module.scss'

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

export function Counter({
  timerStart,
  timerReset,
  setTimerReset,
  activeTimer,
  optionTimerTomato,
  // setTimerStart,
  // reset,
}) {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [randomNumber, setRandomNumber] = useState(
    Math.floor(Math.random() * music.length)
  )

  const [audio, setAudio] = useState(new Audio(music[randomNumber]))

  audio.volume = 0.1
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
      setTimerReset(true)
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
      if (timerStart) {
        if (timeTomatoMsec.current.work) {
          if (timeTomatoMsec.current.end === 0) {
            timeTomatoMsec.current.end =
              Date.now() + timeTomatoMsec.current.totalWork
          } else {
            timeTomatoMsec.current.end =
              timeTomatoMsec.current.end +
              Date.now() -
              timeTomatoMsec.current.now
          }

          interval = setInterval(() => {
            timeTomatoMsec.current.now = Date.now()
            getTimeRemainingTomato()

            if (differentMsec.current < 1000 && differentMsec.current !== 0) {
              clearInterval(interval)

              audio.play()
              setRandomNumber(Math.floor(Math.random() * music.length))

              timeTomatoMsec.current = {
                ...timeTomatoMsec.current,
                work: false,
                break: true,
                now: 0,
                end: 0,
              }
              differentMsec.current = 0
            }
          }, 1000)
        } else if (timeTomatoMsec.current.break) {
          if (timeTomatoMsec.current.end === 0) {
            timeTomatoMsec.current.end =
              Date.now() + timeTomatoMsec.current.totalBreak
          } else {
            timeTomatoMsec.current.end =
              timeTomatoMsec.current.end +
              Date.now() -
              timeTomatoMsec.current.now
          }

          interval = setInterval(() => {
            timeTomatoMsec.current.now = Date.now()

            getTimeRemainingTomato()

            if (differentMsec.current < 1000 && differentMsec.current !== 0) {
              clearInterval(interval)

              audio.play()
              setRandomNumber(Math.floor(Math.random() * music.length))

              timeTomatoMsec.current = {
                ...timeTomatoMsec.current,
                work: true,
                break: false,
                now: 0,
                end: 0,
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
    setAudio(new Audio(music[randomNumber]))
  }, [randomNumber])

  useEffect(() => {
    if (timerReset) {
      timeMsec.current = { start: 0, now: 0 }
      setTime({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      })
      if (timeTomatoMsec.current.end !== 0 || timeTomatoMsec.current.now !== 0)
        timeTomatoMsec.current = { ...timeTomatoMsec.current, now: 0, end: 0 }

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
