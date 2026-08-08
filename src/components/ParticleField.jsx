import { useRef, useEffect } from 'react'

export default function ParticleField({ className = '', progress = 0 }) {
  const canvasRef = useRef(null)
  const progressRef = useRef(progress)

  // Keep progress ref in sync
  progressRef.current = progress

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []
    let w, h

    const resize = () => {
      const parent = canvas.parentElement
      w = canvas.width = parent.offsetWidth
      h = canvas.height = parent.offsetHeight
    }

    const createParticles = () => {
      const count = Math.floor((w * h) / 12000)
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        r: Math.random() * 1.5 + 0.5,
      }))
    }

    const lerp = (a, b, t) => Math.round(a + (b - a) * t)

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      const p = Math.max(0, Math.min(1, progressRef.current))

      // Particle color: dark slide → white-blue tint, light slide → dark blue with white
      const r = lerp(220, 25, p)
      const g = lerp(230, 35, p)
      const b = lerp(255, 60, p)

      // Update positions
      for (const pt of particles) {
        pt.x += pt.vx
        pt.y += pt.vy
        if (pt.x < 0 || pt.x > w) pt.vx *= -1
        if (pt.y < 0 || pt.y > h) pt.vy *= -1
      }

      // Draw connections
      const maxDist = 80
      ctx.lineWidth = 1.2
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.5
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw dots
      for (const pt of particles) {
        ctx.fillStyle = `rgba(${r},${g},${b},0.8)`
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, pt.r * 1.5, 0, Math.PI * 2)
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    createParticles()
    draw()

    const onResize = () => {
      resize()
      createParticles()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  )
}
