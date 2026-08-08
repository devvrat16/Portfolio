import { useRef, useEffect } from 'react'
import FadeIn from './FadeIn'

const certs = [
  { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2024', photo: 'https://picsum.photos/seed/aws2024/80/80' },
  { name: 'Google IT Support Professional', issuer: 'Google', year: '2024', photo: 'https://picsum.photos/seed/googlesup/80/80' },
  { name: 'IBM Data Science Professional', issuer: 'IBM', year: '2023', photo: 'https://picsum.photos/seed/ibmdata/80/80' },
  { name: 'Meta Front-End Developer', issuer: 'Meta', year: '2023', photo: 'https://picsum.photos/seed/metafront/80/80' },
  { name: 'Deep Learning Specialization', issuer: 'Coursera', year: '2024', photo: 'https://picsum.photos/seed/dlcourse/80/80' },
]

const TICKER_TEXT = 'CERTIFICATIONS'

export default function Certifications() {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let start = null
    const speed = 120 // px per second
    let offset = 0
    let paused = false
    let rafId

    const halfWidth = track.scrollWidth / 2

    const tick = (ts) => {
      if (!start) start = ts
      if (!paused) {
        const dt = (ts - start) / 1000
        offset = (offset + speed * dt) % halfWidth
        track.style.transform = `translateX(-${offset}px)`
      }
      start = ts
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    const wrap = track.parentElement
    const onEnter = () => { paused = true }
    const onLeave = () => { paused = false; start = null }
    wrap.addEventListener('mouseenter', onEnter)
    wrap.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(rafId)
      wrap.removeEventListener('mouseenter', onEnter)
      wrap.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <section
      id="certifications"
      className="relative overflow-hidden py-20 md:py-28"
      style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #050d1a 15%, #0a1628 35%, #0a1628 100%)' }}
    >
      {/* ── Marquee Title (JS-driven, no CSS animation conflicts) ── */}
      <div
        className="border-y border-white/8 py-5 md:py-7 mb-16 md:mb-24"
        style={{ overflow: 'hidden', width: '100%' }}
      >
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            width: 'max-content',
            whiteSpace: 'nowrap',
            willChange: 'transform',
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '0 1.5rem',
                fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(2.5rem, 7vw, 6rem)',
                color: '#ffffff',
                whiteSpace: 'nowrap',
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                userSelect: 'none',
                flexShrink: 0,
              }}
            >
              {TICKER_TEXT}
              <span style={{ fontSize: 'clamp(0.8rem, 2vw, 1.2rem)', color: '#6366f1', opacity: 0.6 }}>
                &#9670;
              </span>
            </span>
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={`dup-${i}`}
              aria-hidden="true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '0 1.5rem',
                fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(2.5rem, 7vw, 6rem)',
                color: '#ffffff',
                whiteSpace: 'nowrap',
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                userSelect: 'none',
                flexShrink: 0,
              }}
            >
              {TICKER_TEXT}
              <span style={{ fontSize: 'clamp(0.8rem, 2vw, 1.2rem)', color: '#6366f1', opacity: 0.6 }}>
                &#9670;
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Certifications Grid ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {certs.map((cert) => (
              <div
                key={cert.name}
                className="group flex items-start gap-4 p-5 md:p-6 border border-white/8 hover:border-white/15 transition-colors duration-500"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <img
                  src={cert.photo}
                  alt={cert.name}
                  className="w-16 h-12 md:w-20 md:h-14 rounded-lg object-cover flex-shrink-0 self-center"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <p className="text-[10px] tracking-[0.2em] text-neutral-500 uppercase mb-2 font-medium">
                    {cert.year}
                  </p>
                  <h3 className="text-sm md:text-base font-bold text-white leading-snug mb-1">
                    {cert.name}
                  </h3>
                  <p className="text-xs text-neutral-500 font-light">
                    {cert.issuer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
