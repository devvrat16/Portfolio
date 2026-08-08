import { useRef, useEffect, useState, useCallback } from 'react'
import ParticleField from './ParticleField'

const COLUMNS = [
  { char: 'D', isSpace: false },
  { char: 'E', isSpace: false },
  { char: 'V', isSpace: false },
  { char: '', isSpace: true },
  { char: 'V', isSpace: false },
  { char: 'R', isSpace: false },
  { char: 'A', isSpace: false },
  { char: 'T', isSpace: false },
]

const TOTAL = COLUMNS.length

function LetterColumn({ char, index, progress, mounted }) {
  const p = Math.max(0, Math.min(1, progress))
  const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2

  const bgR = Math.round(10 + (244 - 10) * ease)
  const bgG = Math.round(22 + (244 - 22) * ease)
  const bgB = Math.round(40 + (245 - 40) * ease)
  const txtR = Math.round(255 + (10 - 255) * ease)
  const txtG = Math.round(255 + (22 - 255) * ease)
  const txtB = Math.round(255 + (40 - 255) * ease)

  const bgColor = `rgb(${bgR},${bgG},${bgB})`
  const textColor = `rgb(${txtR},${txtG},${txtB})`
  const gradientOpacity = 1 - ease
  const glowOpacity = 0.3 * (1 - ease)

  const entranceDelay = 0.15 + index * 0.1
  const entranceY = mounted ? 0 : 60
  const entranceOpacity = mounted ? 1 : 0

  return (
    <div
      className="relative flex-1 h-full flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: gradientOpacity,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: glowOpacity,
          background: 'radial-gradient(circle at 50% 50%, rgba(100,150,255,0.3) 0%, transparent 55%)',
        }}
      />

      <span
        className="relative z-10 font-black select-none"
        style={{
          color: textColor,
          fontSize: 'clamp(2.5rem, 16vw, 22rem)',
          lineHeight: 1,
          letterSpacing: '-0.03em',
          textShadow: `0 0 60px rgba(0,0,0,${0.25 * (1 - ease)})`,
          userSelect: 'none',
          transform: `translateY(${entranceY + 180}px)`,
          opacity: entranceOpacity,
          transition: `transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${entranceDelay}s, opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${entranceDelay}s`,
        }}
      >
        {char}
      </span>
    </div>
  )
}

function SpaceColumn({ progress }) {
  const p = Math.max(0, Math.min(1, progress))
  const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
  const bgR = Math.round(10 + (244 - 10) * ease)
  const bgG = Math.round(22 + (244 - 22) * ease)
  const bgB = Math.round(40 + (245 - 40) * ease)

  return (
    <div
      className="hidden md:block overflow-hidden flex-shrink-0"
      style={{
        backgroundColor: `rgb(${bgR},${bgG},${bgB})`,
        width: 'clamp(6px, 1.2vw, 18px)',
        height: '100%',
      }}
    />
  )
}

export default function Hero({ inverted }) {
  const containerRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const rafRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Auto-scroll from Hero to Portfolio
  useEffect(() => {
    const timer = setTimeout(() => {
      const portfolio = document.getElementById('portfolio')
      if (portfolio) {
        const target = portfolio.getBoundingClientRect().top + window.scrollY
        const start = window.scrollY
        const distance = target - start
        const duration = 1800
        let startTime = null

        const step = (timestamp) => {
          if (!startTime) startTime = timestamp
          const elapsed = timestamp - startTime
          const progress = Math.min(elapsed / duration, 1)
          // ease-in-out cubic
          const ease = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2
          window.scrollTo(0, start + distance * ease)
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    rafRef.current = requestAnimationFrame(() => {
      const rect = containerRef.current.getBoundingClientRect()
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight
      const scrolled = -rect.top
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable))
      setScrollProgress(progress)
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [handleScroll])

  const getColumnProgress = (index) => {
    const segStart = index / TOTAL
    const segEnd = (index + 1) / TOTAL
    const segLen = segEnd - segStart
    return Math.max(0, Math.min(1, (scrollProgress - segStart) / segLen))
  }

  const flexDirection = isMobile ? 'flex-col' : 'flex-row'

  return (
    <div ref={containerRef} id="home" className="relative" style={{ height: '400vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Particle network background — colors follow scroll */}
        <ParticleField progress={scrollProgress} />

        {/* Background columns — shifted down to sit below photo + icons */}
        <div className={`absolute inset-0 flex ${flexDirection}`}>
          {COLUMNS.map((col, i) =>
            col.isSpace ? (
              <SpaceColumn key={i} progress={getColumnProgress(i)} />
            ) : (
              <LetterColumn
                key={i}
                char={col.char}
                index={i}
                progress={getColumnProgress(i)}
                mounted={mounted}
              />
            )
          )}
        </div>

        {/* Circular photo — center */}
        <div
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          style={{ paddingBottom: '18vh' }}
        >
          <div
            className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-2 border-white/20"
            style={{
              filter: inverted ? 'invert(1) hue-rotate(180deg)' : 'none',
              transform: mounted ? 'translateY(0)' : 'translateY(40px)',
              opacity: mounted ? 1 : 0,
              transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s, opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s',
            }}
          >
            <img
              src="profile.jpeg"
              alt="Dev Vrat"
              className="w-full h-full object-cover"
              style={{ objectPosition: '50% 20%' }}  /* center-x, top-y (zoom toward face) */
            />
          </div>
        </div>

        {/* Social icons — bottom center */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 z-20 pointer-events-none">
          {/* Social icons — no boxes, color follows scroll */}
          <div
            className="flex gap-5 mt-4 pointer-events-auto"
            style={{
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              opacity: mounted ? 1 : 0,
              transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.5s, opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.5s',
            }}
          >
            {/* GitHub */}
            <a href="https://github.com/devvrat16" target="_blank" rel="noopener noreferrer" style={{ color: `rgb(${Math.round(220 - 195 * scrollProgress)},${Math.round(230 - 195 * scrollProgress)},${255 - 195 * scrollProgress})`, opacity: 0.6 }} className="hover:opacity-100 transition-opacity">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/dev-vrat-9a0781276/" target="_blank" rel="noopener noreferrer" style={{ color: `rgb(${Math.round(220 - 195 * scrollProgress)},${Math.round(230 - 195 * scrollProgress)},${255 - 195 * scrollProgress})`, opacity: 0.6 }} className="hover:opacity-100 transition-opacity">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            {/* Instagram */}
            <a href="https://www.instagram.com/dev_vrat16/" target="_blank" rel="noopener noreferrer" style={{ color: `rgb(${Math.round(220 - 195 * scrollProgress)},${Math.round(230 - 195 * scrollProgress)},${255 - 195 * scrollProgress})`, opacity: 0.6 }} className="hover:opacity-100 transition-opacity">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            {/* X / Twitter */}
            <a href="https://x.com/DevVrat1601" target="_blank" rel="noopener noreferrer" style={{ color: `rgb(${Math.round(220 - 195 * scrollProgress)},${Math.round(230 - 195 * scrollProgress)},${255 - 195 * scrollProgress})`, opacity: 0.6 }} className="hover:opacity-100 transition-opacity">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
