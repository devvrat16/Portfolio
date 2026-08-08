import { useEffect, useRef, useState } from 'react'

export default function FadeIn({ children, className = '' }) {
  const ref = useRef(null)
  const [opacity, setOpacity] = useState(0)
  const [translateY, setTranslateY] = useState(50)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleScroll = () => {
      const rect = el.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Element starts fading when its top enters the bottom of viewport
      // Fully visible when its top reaches 75% of viewport height
      const startFade = windowHeight       // top of element at bottom of viewport
      const endFade = windowHeight * 0.75  // top of element at 75% viewport

      if (rect.top >= startFade) {
        setOpacity(0)
        setTranslateY(50)
      } else if (rect.top <= endFade) {
        setOpacity(1)
        setTranslateY(0)
      } else {
        const progress = (startFade - rect.top) / (startFade - endFade)
        const eased = progress * progress * (3 - 2 * progress) // smoothstep
        setOpacity(eased)
        setTranslateY(50 * (1 - eased))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        transition: 'none',
      }}
    >
      {children}
    </div>
  )
}
