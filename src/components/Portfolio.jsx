import { useState, useEffect, useRef, useCallback } from 'react'
import FadeIn from './FadeIn'
import ParticleField from './ParticleField'

const LETTERS = 'PORTFOLIO'.split('')

export default function Portfolio({ inverted, onToggle }) {
  const [dropped, setDropped] = useState(false)
  const [dropping, setDropping] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const sectionRef = useRef(null)
  const rafRef = useRef(null)
  const letterRefs = useRef([])
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      if (!scrolled && window.scrollY > 100) setScrolled(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [scrolled])

  const handleScroll = useCallback((e) => {
    e.stopPropagation()
    const about = document.getElementById('about')
    if (about) about.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleDrop = useCallback(
    (e) => {
      e.stopPropagation()
      if (dropped || dropping) return

      setDropping(true)

      const section = sectionRef.current
      const sectionH = section ? section.clientHeight : 400
      const floor = sectionH * 0.38 // letters settle near bottom third

      // Initialize physics state in a ref
      const physics = letterRefs.current.map(() => ({
        x: 0,
        y: 0,
        rotation: 0,
        vx: (Math.random() - 0.5) * 6,
        vy: -3 - Math.random() * 3, // launch up first
        vr: (Math.random() - 0.5) * 18,
      }))

      const GRAVITY = 0.2
      const BOUNCE = 0.45
      const FRICTION = 0.985
      const ROT_FRICTION = 0.97

      const animate = () => {
        let allSettled = true

        letterRefs.current.forEach((el, i) => {
          if (!el) return
          const p = physics[i]

          p.vy += GRAVITY
          p.x += p.vx
          p.y += p.vy
          p.rotation += p.vr
          p.vx *= FRICTION
          p.vr *= ROT_FRICTION

          // Floor bounce
          if (p.y > floor) {
            p.y = floor
            p.vy *= -BOUNCE
            p.vx *= 0.9
            p.vr *= 0.8
          }

          // Ceiling bounce
          if (p.y < -floor) {
            p.y = -floor
            p.vy *= -BOUNCE
          }

          // Side bounce (keep within ~80% of section width)
          const maxX = (section ? section.clientWidth : 800) * 0.42
          if (Math.abs(p.x) > maxX) {
            p.x = Math.sign(p.x) * maxX
            p.vx *= -BOUNCE
          }

          el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg)`

          // Check if letter is still moving
          if (Math.abs(p.vy) > 0.3 || Math.abs(p.vx) > 0.2 || Math.abs(p.vr) > 0.5) {
            allSettled = false
          }
        })

        if (!allSettled) {
          rafRef.current = requestAnimationFrame(animate)
        } else {
          setDropping(false)
          setDropped(true)
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    },
    [dropped, dropping]
  )

  const handleRestore = useCallback(
    (e) => {
      e.stopPropagation()
      cancelAnimationFrame(rafRef.current)

      // Animate back to center
      letterRefs.current.forEach((el) => {
        if (el) {
          el.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
          el.style.transform = 'none'
        }
      })

      setTimeout(() => {
        letterRefs.current.forEach((el) => {
          if (el) el.style.transition = 'none'
        })
        setDropped(false)
      }, 650)
    },
    []
  )

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative w-full h-[50vh] flex flex-col justify-center items-center overflow-hidden select-none"
      style={{
        background: 'linear-gradient(160deg, #0a1628 0%, #000000 100%)',
      }}
    >
      {/* Particle network background */}
      <ParticleField />

      {/* Hamburger — top right */}
      {scrolled && !dropping && !dropped && (
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
          className="absolute top-5 right-5 md:top-8 md:right-8 z-40 flex flex-col gap-1.5 cursor-pointer group p-2"
        >
          <span className={`block w-8 h-[2.5px] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px] !bg-white' : 'bg-white/80'}`} />
          <span className={`block w-8 h-[2.5px] transition-all duration-300 ${menuOpen ? 'opacity-0' : 'bg-white/80'}`} />
          <span className={`block w-8 h-[2.5px] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px] !bg-white' : 'bg-white/80'}`} />
        </button>
      )}

      {/* Index panel — slides from right */}
      {menuOpen && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center"
          onClick={() => setMenuOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          {/* Index content */}
          <div className="relative z-10 flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
            {['Home', 'Portfolio', 'About', 'Skills', 'Projects', 'Certifications', 'Contact'].map((item, i) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="text-white/80 hover:text-white text-lg md:text-xl tracking-[0.3em] uppercase font-medium transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* SCROLL — bottom left */}
      {scrolled && !dropping && !dropped && (
        <button
          onClick={handleScroll}
          className="absolute bottom-5 left-5 md:bottom-8 md:left-8 z-20 flex items-center gap-2 cursor-pointer group"
        >
          <svg
            width="12"
            height="20"
            viewBox="0 0 12 20"
            fill="none"
            className="text-white/50 group-hover:text-white/80 transition-colors"
          >
            <path
              d="M6 0V18M6 18L1 13M6 18L11 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[9px] md:text-[10px] tracking-[0.3em] text-white/50 uppercase font-medium group-hover:text-white/80 transition-colors">
            SCROLL
          </span>
        </button>
      )}

      {/* Invert toggle — bottom center */}
      {scrolled && !menuOpen && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggle() }}
          aria-label={inverted ? 'Switch to dark mode' : 'Switch to light mode'}
          className="absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 z-20 cursor-pointer group"
        >
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300"
            style={{
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <div
              className="w-2 h-2 rounded-full transition-colors duration-300"
              style={{ background: inverted ? '#facc15' : '#6366f1' }}
            />
            <span className="text-[10px] tracking-[0.2em] text-white/60 uppercase font-medium group-hover:text-white/90 transition-colors">
              {inverted ? 'Light Mode' : 'Dark Mode'}
            </span>
          </div>
        </button>
      )}

      {/* DON'T TOUCH — bottom right */}
      {scrolled && !dropping && !dropped && (
        <button
          onClick={handleDrop}
          className="absolute bottom-5 right-5 md:bottom-8 md:right-8 z-20 flex items-center gap-2 cursor-pointer group"
        >
          <span className="text-[9px] md:text-[10px] tracking-[0.3em] text-white/50 uppercase font-medium group-hover:text-white/80 transition-colors">
            DON'T TOUCH
          </span>
          <div className="w-4 h-4 rounded-full border border-white/50 group-hover:border-white/80 flex items-center justify-center transition-colors">
            <span className="text-[8px] text-white/50 group-hover:text-white/80 transition-colors">✗</span>
          </div>
        </button>
      )}

      {/* Main PORTFOLIO text */}
      <FadeIn>
        <div
          className="flex justify-center items-center gap-[0.08em] px-4 flex-wrap transition-opacity duration-300"
          style={{ opacity: menuOpen ? 0.25 : 1 }}
        >
          {LETTERS.map((char, i) => (
            <span
              key={i}
              ref={(el) => (letterRefs.current[i] = el)}
              className="font-black uppercase select-none leading-none text-white"
              style={{
                fontSize: 'clamp(3rem, 13vw, 14rem)',
                letterSpacing: '-0.03em',
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </FadeIn>

      {/* RESTORE — bottom right (same style as DON'T TOUCH) */}
      {dropped && (
        <button
          onClick={handleRestore}
          className="absolute bottom-5 right-5 md:bottom-8 md:right-8 z-20 flex items-center gap-2 cursor-pointer group"
        >
          <span className="text-[9px] md:text-[10px] tracking-[0.3em] text-white/50 uppercase font-medium group-hover:text-white/80 transition-colors">
            RESTORE
          </span>
          <div className="w-4 h-4 rounded-full border border-white/50 group-hover:border-white/80 flex items-center justify-center transition-colors">
            <span className="text-[8px] text-white/50 group-hover:text-white/80 transition-colors">↺</span>
          </div>
        </button>
      )}
    </section>
  )
}
