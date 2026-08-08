import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'

const TAGS = [
  { label: 'GSAP', primary: true },
  { label: 'WebGL', primary: true },
  { label: 'Solidity', primary: true },
  { label: 'Lodash', primary: true },
  { label: 'Node.js', primary: true },
  { label: 'Nuxt.js', primary: true },
  { label: 'HTML', primary: true },
  { label: 'ReactJS', primary: true },
  { label: 'Next.js', primary: true },
  { label: 'TypeScript', primary: true },
  { label: 'Python', primary: true },
  { label: 'PostgreSQL', primary: true },
  { label: 'JavaScript', primary: false },
  { label: 'Sass', primary: false },
  { label: 'CSS', primary: false },
  { label: 'Vue.js', primary: false },
  { label: 'TailwindCSS', primary: false },
  { label: 'MongoDB', primary: false },
  { label: 'Docker', primary: false },
  { label: 'AWS', primary: false },
  { label: 'Firebase', primary: false },
  { label: 'Git', primary: false },
  { label: 'REST APIs', primary: false },
  { label: 'Webpack', primary: false },
  { label: 'Vite', primary: false },
  { label: 'Figma', primary: false },
  { label: 'Redux', primary: false },
  { label: 'GraphQL', primary: false },
  { label: 'Jest', primary: false },
]

function rand(min, max) { return min + Math.random() * (max - min) }

// Compute grid positions so tags don't overlap
function computeGrid(count, cols) {
  const rows = Math.ceil(count / cols)
  const cells = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({
        x: ((c + 0.5) / cols) * 80 + 10, // 10–90% range
        y: ((r + 0.5) / rows) * 65 + 25,  // 25–90% range (below heading)
      })
    }
  }
  return cells
}

// Shuffle array (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function TechStack() {
  const canvasRef = useRef(null)
  const tagRefs = useRef([])
  const prevMouse = useRef({ x: 0, y: 0, time: 0 })
  const mouseVel = useRef({ x: 0, y: 0 })
  const offsets = useRef([])
  const targets = useRef([])
  const masses = useRef([])

  const handleMouseMove = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const now = performance.now()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const dt = Math.max(now - prevMouse.current.time, 1)

    const vx = (mx - prevMouse.current.x) / dt * 16
    const vy = (my - prevMouse.current.y) / dt * 16

    if (Math.abs(vx) > 0.1 || Math.abs(vy) > 0.1) {
      mouseVel.current.x = vx * 0.5
      mouseVel.current.y = vy * 0.5

      tagRefs.current.forEach((_, i) => {
        if (!offsets.current[i]) return
        const mass = masses.current[i] || 1
        targets.current[i].x += mouseVel.current.x * mass
        targets.current[i].y += mouseVel.current.y * mass
      })
    }

    prevMouse.current = { x: mx, y: my, time: now }
  }, [])

  const handleMouseLeave = useCallback(() => {
    targets.current = targets.current.map(() => ({ x: 0, y: 0 }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.addEventListener('mousemove', handleMouseMove, { passive: true })
    canvas.addEventListener('mouseleave', handleMouseLeave)

    // Grid-based placement: 5 cols for 29 tags
    const cols = 5
    const gridCells = computeGrid(TAGS.length, cols)
    const shuffledCells = shuffle(gridCells)

    // Initialize per-tag
    tagRefs.current.forEach((el, i) => {
      if (!el) return

      masses.current[i] = 0.3 + Math.random() * 0.7
      offsets.current[i] = { x: 0, y: 0 }
      targets.current[i] = { x: 0, y: 0 }

      const cell = shuffledCells[i]
      // Base position is the grid cell center
      el._baseX = cell.x
      el._baseY = cell.y

      gsap.set(el, {
        xPercent: -50,
        yPercent: -50,
        left: `${cell.x}%`,
        top: `${cell.y}%`,
      })

      // Drift randomly across entire area
      const startDrift = () => {
        const destX = rand(5, 90)
        const destY = rand(25, 90)
        gsap.to(el, {
          left: `${destX}%`,
          top: `${destY}%`,
          duration: rand(8, 20),
          ease: 'sine.inOut',
          onComplete: startDrift,
        })
      }

      gsap.delayedCall(i * 0.4 + rand(0, 1), startDrift)
    })

    // Animation loop
    let rafId
    const animate = () => {
      tagRefs.current.forEach((el, i) => {
        if (!el) return
        const mass = masses.current[i] || 1

        targets.current[i].x *= 0.96
        targets.current[i].y *= 0.96

        const lerpSpeed = 0.03 + (1 - mass) * 0.04
        offsets.current[i].x += (targets.current[i].x - offsets.current[i].x) * lerpSpeed
        offsets.current[i].y += (targets.current[i].y - offsets.current[i].y) * lerpSpeed

        // Smaller clamp range to stay within grid cell
        const maxOffsetX = 40
        const maxOffsetY = 30
        const ox = Math.max(-maxOffsetX, Math.min(maxOffsetX, offsets.current[i].x))
        const oy = Math.max(-maxOffsetY, Math.min(maxOffsetY, offsets.current[i].y))

        el.style.marginLeft = `${ox}px`
        el.style.marginTop = `${oy}px`
      })

      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      tagRefs.current.forEach((el) => { if (el) gsap.killTweensOf(el) })
    }
  }, [handleMouseMove, handleMouseLeave])

  return (
    <section
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ background: '#f4f4f5', minHeight: '80vh' }}
    >
      {/* Noise overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
        <svg width="100%" height="100%">
          <filter id="techStackGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#techStackGrain)" />
        </svg>
      </div>

      {/* Heading */}
      <div className="absolute top-10 md:top-16 left-0 right-0 text-center pointer-events-none z-10">
        <h2 className="text-[3rem] md:text-[5rem] lg:text-[6.5rem] font-black tracking-tight uppercase text-[#09090b]/5 leading-none select-none">
          Skills
        </h2>
      </div>

      {/* Floating tags canvas */}
      <div ref={canvasRef} className="relative w-full max-w-[800px] aspect-[4/3] mx-auto" style={{ cursor: 'default' }}>
        {TAGS.map((tag, i) => (
          <span
            key={tag.label}
            ref={(el) => { tagRefs.current[i] = el }}
            className="absolute select-none pointer-events-none whitespace-nowrap"
            style={{
              fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
              fontWeight: tag.primary ? 800 : 400,
              fontSize: tag.primary ? 'clamp(20px, 3.5vw, 32px)' : 'clamp(14px, 2.5vw, 22px)',
              color: tag.primary ? '#09090b' : 'rgba(9,9,11,0.45)',
              letterSpacing: '-0.02em',
              willChange: 'transform',
            }}
          >
            {tag.label}
          </span>
        ))}
      </div>
    </section>
  )
}
