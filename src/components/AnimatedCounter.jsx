import { useEffect, useRef, useState } from 'react'

export default function AnimatedCounter({ value, duration = 800, suffix = '' }) {
  const [display, setDisplay] = useState(value)
  const startRef = useRef(null)
  const prevRef  = useRef(value)
  const rafRef = useRef(null)

  useEffect(() => {
    const from = prevRef.current
    const to = value
    prevRef.current = value
    if (from === to) return

    startRef.current = null
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts
      const elapsed = ts - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(from + (to - from) * eased))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value, duration])

  return <span>{display}{suffix}</span>
}
