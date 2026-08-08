import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SLIDES = [
  {
    num: '01',
    title: 'IdeaForge',
    desc: 'A full-stack web app for generating, organizing, and refining creative ideas with AI-powered suggestions.',
    cta: 'View Project',
  },
  {
    num: '02',
    title: 'Deepfake Detection',
    desc: 'AI/ML platform that detects manipulated media using deep learning models and neural network analysis.',
    cta: 'View Project',
  },
  {
    num: '03',
    title: 'SecurNet',
    desc: 'Frontend security dashboard for real-time network monitoring, threat detection, and vulnerability scanning.',
    cta: 'View Project',
  },
  {
    num: '04',
    title: 'Robotic Prosthetic Hand',
    desc: 'Data-driven prosthetic hand with sensor feedback, gesture recognition, and adaptive motor control.',
    cta: 'View Project',
  },
  {
    num: '05',
    title: 'Portfolio',
    desc: 'Premium personal portfolio built with React, GSAP, and Tailwind — featuring scroll-driven animations and 3D interactions.',
    cta: 'View Project',
  },
]

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)) }

export default function NumberedScrollShowcase() {
  const outerRef = useRef(null)
  const titleRef = useRef(null)
  const cardRefs = useRef([])
  const numberRefs = useRef([])
  const glowRefs = useRef([])
  const mouse = useRef({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e) => {
    mouse.current = { x: e.clientX, y: e.clientY }
  }, [])

  useEffect(() => {
    const outer = outerRef.current
    if (!outer) return

    const vh = window.innerHeight

    // Timing
    const holdDur = vh * 0.4       // hold centered
    const slideDur = vh * 0.35     // slide into place
    const gapDur = 0                // no gap — title exit ends as card 1 enters
    const cardDur = holdDur + slideDur // ~0.75vh per card
    const exitDur = vh * 0.45      // stack exit duration

    // Offset: card 1 starts after title exits + gap
    const offset = holdDur + slideDur + gapDur

    // --- Title: card 0 ---
    if (titleRef.current) {
      gsap.set(titleRef.current, { zIndex: 100, opacity: 1 })

      gsap.to(titleRef.current, {
        y: '-100vh',
        opacity: 0,
        scale: 0.9,
        ease: 'none',
        scrollTrigger: {
          trigger: outer,
          start: `top+=${holdDur} top`,
          end: `top+=${holdDur + slideDur} top`,
          scrub: 2,
        },
      })
    }

    // --- Cards: stacked, each slides over previous ---
    cardRefs.current.forEach((card, i) => {
      if (!card) return

      const glowEl = glowRefs.current[i]
      if (glowEl) gsap.set(glowEl, { opacity: 0 })

      // z-index: card 1 on top, card 5 highest
      card.style.zIndex = (i + 1) * 10

      // Start hidden below viewport
      gsap.set(card, { y: '100vh', opacity: 0, scale: 0.95 })

      const entryStart = offset + i * cardDur
      const entryEnd = entryStart + slideDur

      if (i < SLIDES.length - 1) {
        // Cards 1–4: slide in, hold, STAY visible (stack builds)
        gsap.to(card, {
          y: '0vh',
          opacity: 1,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: outer,
            start: `top+=${entryStart} top`,
            end: `top+=${entryEnd} top`,
            scrub: 2,
            onEnter: () => { if (glowEl) gsap.to(glowEl, { opacity: 1, duration: 0.4 }) },
            onEnterBack: () => { if (glowEl) gsap.to(glowEl, { opacity: 1, duration: 0.4 }) },
          },
        })
        // No exit — card stays beneath the next card
      } else {
        // Card 5: slide in, shorter hold, fast stack exit
        const exitStart = entryEnd + holdDur * 0.5
        const exitEnd = exitStart + exitDur

        gsap.to(card, {
          y: '0vh',
          opacity: 1,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: outer,
            start: `top+=${entryStart} top`,
            end: `top+=${entryEnd} top`,
            scrub: 2,
            onEnter: () => { if (glowEl) gsap.to(glowEl, { opacity: 1, duration: 0.4 }) },
            onEnterBack: () => { if (glowEl) gsap.to(glowEl, { opacity: 1, duration: 0.4 }) },
          },
        })

        // ALL cards exit upward together after card 5 settles
        cardRefs.current.forEach((c, ci) => {
          const glow = glowRefs.current[ci]
          gsap.to(c, {
            y: '-100vh',
            opacity: 0,
            scale: 0.9,
            ease: 'none',
            scrollTrigger: {
              trigger: outer,
              start: `top+=${exitStart} top`,
              end: `top+=${exitEnd} top`,
              scrub: 2,
              onLeave: () => { if (glow) gsap.to(glow, { opacity: 0, duration: 0.15 }) },
              onLeaveBack: () => { if (glow) gsap.to(glow, { opacity: 1, duration: 0.2 }) },
            },
          })
        })
      }
    })

    // --- Mouse 3D tilt ---
    let rafId
    const animate = () => {
      const { x, y } = mouse.current

      let topEl = null
      let topZ = -Infinity

      if (titleRef.current) {
        const opacity = parseFloat(getComputedStyle(titleRef.current).opacity)
        const z = parseInt(getComputedStyle(titleRef.current).zIndex) || 0
        if (opacity > 0.5) { topEl = titleRef.current; topZ = z }
      }

      cardRefs.current.forEach((card) => {
        if (!card) return
        const opacity = parseFloat(getComputedStyle(card).opacity)
        if (opacity > topZ / 1000) {
          topZ = opacity * 1000
          topEl = card
        }
      })

      if (topEl) {
        const rect = topEl.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = (x - cx) / (rect.width / 2)
        const dy = (y - cy) / (rect.height / 2)

        const tiltX = clamp(dy * -2, -2, 2)
        const tiltY = clamp(dx * 2, -2, 2)

        const inner = topEl.querySelector('.card-inner')
        if (inner) {
          inner.style.transform =
            `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
        }

        const idx = parseInt(topEl.dataset?.index)
        if (idx !== undefined) {
          const numEl = numberRefs.current[idx]
          if (numEl) {
            numEl.style.transform = `translate(${dx * -10}px, ${dy * -10}px)`
          }
        }
      }

      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  // Adjusted height for gaps between title→cards and cards→certifications
  const sectionVh = 550

  return (
    <section
      ref={outerRef}
      className="relative w-full"
      style={{
        background: 'linear-gradient(160deg, #0d1f3c 0%, #060d18 50%, #0a0a0a 100%)',
        height: `${sectionVh}vh`,
      }}
    >
      {/* Sticky stage */}
      <div
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
        style={{ zIndex: 100 }}
      >
        {/* ── Floating tech icons — z-index below title (200) but above cards ── */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 150 }}>
          {/* TOP ROW — evenly spaced across top */}
          <svg className="absolute" style={{ top: '2%', left: '5%', opacity: 0.08, width: 42, height: 42 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
          <svg className="absolute" style={{ top: '3%', left: '20%', opacity: 0.08, width: 38, height: 38 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
          <svg className="absolute" style={{ top: '1%', left: '35%', opacity: 0.075, width: 40, height: 40 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          <svg className="absolute" style={{ top: '2%', left: '50%', opacity: 0.06, width: 44, height: 44 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
          <svg className="absolute" style={{ top: '3%', left: '65%', opacity: 0.075, width: 36, height: 36 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
          <svg className="absolute" style={{ top: '1%', left: '80%', opacity: 0.06, width: 40, height: 40 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
          <svg className="absolute" style={{ top: '2%', right: '5%', opacity: 0.08, width: 42, height: 42 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg>

          {/* LEFT COLUMN — evenly spaced down left edge */}
          <svg className="absolute" style={{ top: '12%', left: '2%', opacity: 0.065, width: 50, height: 50 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
          <svg className="absolute" style={{ top: '24%', left: '3%', opacity: 0.06, width: 44, height: 44 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" /></svg>
          <svg className="absolute" style={{ top: '36%', left: '1%', opacity: 0.06, width: 48, height: 48 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="15" x2="23" y2="15" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="15" x2="4" y2="15" /></svg>
          <svg className="absolute" style={{ top: '48%', left: '2%', opacity: 0.08, width: 42, height: 42 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
          <svg className="absolute" style={{ top: '60%', left: '3%', opacity: 0.065, width: 46, height: 46 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>
          <svg className="absolute" style={{ top: '72%', left: '1%', opacity: 0.06, width: 44, height: 44 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 22v-5" /><path d="M9 8V2" /><path d="M15 8V2" /><path d="M18 8v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8z" /></svg>
          <svg className="absolute" style={{ top: '84%', left: '2%', opacity: 0.06, width: 40, height: 40 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>

          {/* RIGHT COLUMN — evenly spaced down right edge */}
          <svg className="absolute" style={{ top: '12%', right: '3%', opacity: 0.065, width: 48, height: 48 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1"><ellipse cx="12" cy="12" rx="10" ry="4" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" /><circle cx="12" cy="12" r="2" fill="white" /></svg>
          <svg className="absolute" style={{ top: '24%', right: '2%', opacity: 0.06, width: 44, height: 44 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>
          <svg className="absolute" style={{ top: '36%', right: '1%', opacity: 0.08, width: 42, height: 42 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
          <svg className="absolute" style={{ top: '48%', right: '3%', opacity: 0.065, width: 46, height: 46 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
          <svg className="absolute" style={{ top: '60%', right: '2%', opacity: 0.06, width: 44, height: 44 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2"><circle cx="12" cy="5" r="3" /><circle cx="4" cy="19" r="3" /><circle cx="20" cy="19" r="3" /><line x1="12" y1="8" x2="4" y2="16" /><line x1="12" y1="8" x2="20" y2="16" /></svg>
          <svg className="absolute" style={{ top: '72%', right: '3%', opacity: 0.065, width: 42, height: 42 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          <svg className="absolute" style={{ top: '84%', right: '1%', opacity: 0.06, width: 40, height: 40 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>

          {/* BOTTOM ROW — evenly spaced across bottom */}
          <svg className="absolute" style={{ bottom: '3%', left: '5%', opacity: 0.08, width: 42, height: 42 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          <svg className="absolute" style={{ bottom: '2%', left: '20%', opacity: 0.08, width: 38, height: 38 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
          <svg className="absolute" style={{ bottom: '3%', left: '35%', opacity: 0.075, width: 40, height: 40 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
          <svg className="absolute" style={{ bottom: '2%', left: '50%', opacity: 0.06, width: 44, height: 44 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" /></svg>
          <svg className="absolute" style={{ bottom: '3%', left: '65%', opacity: 0.075, width: 36, height: 36 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          <svg className="absolute" style={{ bottom: '2%', left: '80%', opacity: 0.08, width: 42, height: 42 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
          <svg className="absolute" style={{ bottom: '3%', right: '5%', opacity: 0.06, width: 40, height: 40 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>

          {/* HOVERING — scattered in gap areas between edges and center cards */}
          <svg className="absolute" style={{ top: '10%', left: '12%', opacity: 0.075, width: 36, height: 36 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
          <svg className="absolute" style={{ top: '10%', right: '12%', opacity: 0.08, width: 38, height: 38 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
          <svg className="absolute" style={{ top: '88%', left: '12%', opacity: 0.075, width: 36, height: 36 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
          <svg className="absolute" style={{ top: '88%', right: '12%', opacity: 0.08, width: 38, height: 38 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
          <svg className="absolute" style={{ top: '15%', left: '88%', opacity: 0.06, width: 34, height: 34 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>
          <svg className="absolute" style={{ top: '85%', left: '88%', opacity: 0.075, width: 34, height: 34 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          <svg className="absolute" style={{ top: '42%', left: '88%', opacity: 0.06, width: 34, height: 34 }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
        </div>

        {/* PROJECTS title — card 0 */}
        <div
          ref={titleRef}
          className="absolute w-full h-full flex items-center justify-center pointer-events-none"
          style={{ zIndex: 200 }}
        >
          <div className="card-inner" style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}>
            <h2
              className="text-center select-none"
              style={{
                fontSize: 'clamp(4rem, 14vw, 10rem)',
                fontWeight: 900,
                fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                letterSpacing: '-0.05em',
                textTransform: 'uppercase',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.3) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Projects
            </h2>
          </div>
        </div>

        {/* Cards */}
        {SLIDES.map((slide, i) => (
          <div
            key={slide.num}
            ref={(el) => { cardRefs.current[i] = el }}
            data-num={slide.num}
            data-index={i}
            className="absolute flex flex-col items-center justify-center overflow-hidden"
            style={{
              width: 'min(98vw, 1100px)',
              height: 'min(78vh, 600px)',
              borderRadius: '36px',
              background: 'linear-gradient(170deg, #161616 0%, #0c0c0c 50%, #121212 100%)',
              boxShadow: '0 12px 80px rgba(0,0,0,0.6)',
              willChange: 'transform, opacity',
              transformStyle: 'preserve-3d',
            }}
            onMouseMove={handleMouseMove}
          >
            <div
              className="card-inner absolute inset-0 flex flex-col items-center justify-center"
              style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  borderRadius: '36px',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, transparent 35%)',
                }}
              />

              <div
                ref={(el) => { glowRefs.current[i] = el }}
                className="absolute pointer-events-none"
                style={{
                  width: 'clamp(160px, 30vw, 300px)',
                  height: 'clamp(160px, 30vw, 300px)',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />

              <div
                ref={(el) => { numberRefs.current[i] = el }}
                className="relative select-none pointer-events-none"
                style={{
                  fontSize: 'clamp(4rem, 14vw, 9rem)',
                  fontWeight: 900,
                  fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                  letterSpacing: '-0.06em',
                  lineHeight: 1,
                  background: 'linear-gradient(180deg, rgba(99,102,241,0.55) 0%, rgba(168,85,247,0.3) 50%, rgba(99,102,241,0.1) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 50px rgba(99,102,241,0.2)) drop-shadow(0 0 100px rgba(168,85,247,0.08))',
                  willChange: 'transform',
                }}
              >
                {slide.num}
              </div>

              <div className="relative z-10 text-center px-8 mt-2 md:mt-4 max-w-lg">
                <h3
                  className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3"
                  style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif', letterSpacing: '-0.03em' }}
                >
                  {slide.title}
                </h3>
                <p
                  className="text-xs md:text-sm lg:text-base mb-5 md:mb-7 leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}
                >
                  {slide.desc}
                </p>

                <button
                  className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    willChange: 'transform',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {slide.cta}
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
