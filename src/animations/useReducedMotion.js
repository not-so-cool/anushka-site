import { useEffect, useState } from 'react'
import { REDUCED_MOTION_QUERY } from './gsap'

export default function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia(REDUCED_MOTION_QUERY).matches
  )

  useEffect(() => {
    const mq = window.matchMedia(REDUCED_MOTION_QUERY)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
