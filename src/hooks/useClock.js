import { useEffect, useState } from 'react'

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

/** A live IST clock, formatted "HH:MM:SS", ticking once a second. */
export function useClock() {
  const [now, setNow] = useState(() => formatter.format(new Date()))

  useEffect(() => {
    const id = setInterval(() => setNow(formatter.format(new Date())), 1000)
    return () => clearInterval(id)
  }, [])

  return now
}
