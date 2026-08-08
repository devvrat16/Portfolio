import { useRef, useEffect } from 'react'

const WORDS = [
  'AI', 'Machine Learning', 'Deep Learning', 'React', 'Next.js',
  'TypeScript', 'Python', 'C++', 'Java', 'Node.js',
  'FastAPI', 'TensorFlow', 'PyTorch', 'AWS', 'Docker',
  'Kubernetes', 'MongoDB', 'PostgreSQL', 'OpenCV', 'LangChain',
  'Supabase', 'Git', 'GitHub', 'N8N', 'Automation',
  'UI/UX', 'APIs',
]

function fibonacciSphere(n) {
  const points = []
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = goldenAngle * i
    points.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r })
  }
  return points
}

const spherePoints = fibonacciSphere(WORDS.length)
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)) }

export default function Skills() {
  const containerRef = useRef(null)
  const wordRefs = useRef([])
  const glowRef = useRef(null)
  const state = useRef({
    rotX: 0.3, rotY: 0, velX: 0, velY: 0,
    lastMouse: { x: 0, y: 0 }, mouseDelta: { x: 0, y: 0 }, mouseActive: false,
  })

  useEffect(() => {
    const s = state.current
    const container = containerRef.current
    if (!container) return

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      s.mouseDelta.x = ((e.clientX - cx) / (rect.width / 2) - s.lastMouse.x) * 2.5
      s.mouseDelta.y = ((e.clientY - cy) / (rect.height / 2) - s.lastMouse.y) * 2.5
      s.lastMouse = { x: (e.clientX - cx) / (rect.width / 2), y: (e.clientY - cy) / (rect.height / 2) }
      s.mouseActive = true
    }
    const onMouseLeave = () => { s.mouseActive = false }

    container.addEventListener('mousemove', onMouseMove, { passive: true })
    container.addEventListener('mouseleave', onMouseLeave)

    let rafId
    let lastTime = performance.now()
    const RADIUS = 260
    const PERSPECTIVE = 900

    const animate = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      s.rotY += 0.2 * dt
      s.rotX += 0.06 * dt

      if (s.mouseActive) {
        s.velY += s.mouseDelta.x * 8
        s.velX += s.mouseDelta.y * 5
        s.mouseDelta.x = 0
        s.mouseDelta.y = 0
      }

      s.velX *= 0.94
      s.velY *= 0.94
      s.rotY += s.velY * dt
      s.rotX += s.velX * dt
      s.rotX = clamp(s.rotX, -1.2, 1.2)

      const cosRX = Math.cos(s.rotX), sinRX = Math.sin(s.rotX)
      const cosRY = Math.cos(s.rotY), sinRY = Math.sin(s.rotY)

      for (let i = 0; i < wordRefs.current.length; i++) {
        const el = wordRefs.current[i]
        if (!el) continue
        const p = spherePoints[i]

        let x = p.x * cosRY - p.z * sinRY
        let z = p.x * sinRY + p.z * cosRY
        let y = p.y
        const y2 = y * cosRX - z * sinRX
        const z2 = y * sinRX + z * cosRX
        y = y2; z = z2

        const scale = PERSPECTIVE / (PERSPECTIVE + z * RADIUS)
        const screenX = x * RADIUS * scale
        const screenY = -y * RADIUS * scale
        const depthNorm = (z + 1) / 2
        const opacity = clamp(depthNorm * 1.5 - 0.2, 0.05, 1)
        const blur = clamp((1 - depthNorm) * 3, 0, 3)
        const fontSize = clamp(scale * 17, 9, 22)

        el.style.transform = `translate(${screenX.toFixed(1)}px, ${screenY.toFixed(1)}px) scale(${scale.toFixed(3)})`
        el.style.opacity = opacity.toFixed(3)
        el.style.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : 'none'
        el.style.fontSize = `${fontSize.toFixed(1)}px`
        el.style.zIndex = Math.round(depthNorm * 100)
      }

      if (glowRef.current) {
        const gx = Math.sin(s.rotY) * RADIUS * 0.3
        const gy = -Math.sin(s.rotX) * RADIUS * 0.2
        glowRef.current.style.left = `calc(50% + ${gx.toFixed(1)}px)`
        glowRef.current.style.top = `calc(50% + ${gy.toFixed(1)}px)`
      }

      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <section
      className="relative w-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #f4f4f5 0%, #e8e8ec 50%, #f4f4f5 100%)',
        minHeight: '100vh',
        padding: '5rem 0',
      }}
    >
      {/* Heading */}
      <div className="text-center mb-6 md:mb-10 z-10 pointer-events-none">
        <h2
          className="text-[3rem] md:text-[5rem] lg:text-[6.5rem] font-black tracking-tight uppercase leading-none select-none"
          style={{
            fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
            color: 'rgba(9,9,11,0.18)',
          }}
        >
          Skills
        </h2>
      </div>

      {/* Globe */}
      <div
        ref={containerRef}
        className="relative z-10 mx-auto"
        style={{ width: 'min(80vw, 600px)', height: 'min(80vw, 600px)', cursor: 'grab' }}
      >
        <div
          ref={glowRef}
          className="absolute pointer-events-none"
          style={{
            width: '300px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.04) 40%, transparent 70%)',
            filter: 'blur(60px)', left: '50%', top: '50%',
            marginLeft: '-150px', marginTop: '-150px',
          }}
        />
        <div className="absolute top-1/2 left-1/2" style={{ width: 0, height: 0 }}>
          {WORDS.map((word, i) => (
            <span
              key={word}
              ref={(el) => { wordRefs.current[i] = el }}
              className="absolute select-none pointer-events-none whitespace-nowrap"
              style={{
                fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                fontWeight: 700, color: '#09090b', letterSpacing: '-0.02em',
                willChange: 'transform, opacity, filter',
                transformOrigin: 'center center', left: 0, top: 0,
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      <p
        className="mt-8 md:mt-12 text-center z-10 pointer-events-none"
        style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(9,9,11,0.25)', fontWeight: 500 }}
      >
        Move your mouse to interact
      </p>
    </section>
  )
}
