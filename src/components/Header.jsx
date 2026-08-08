import { useEffect, useState } from 'react'

export default function Header() {
  const [visible, setVisible] = useState(false)
  const [darkText, setDarkText] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('home')
    if (!hero) return

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting)
      },
      { threshold: 0.1 }
    )
    heroObserver.observe(hero)

    // Observe all sections to detect light backgrounds
    const sections = document.querySelectorAll('section, footer')
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Check if the section has a light background
            const bg = window.getComputedStyle(entry.target).backgroundColor
            const isLight = entry.target.classList.contains('bg-[#f4f4f5]') ||
              entry.target.style.background?.includes('#f4f4f5')
            setDarkText(isLight)
          }
        })
      },
      { threshold: 0.3 }
    )

    sections.forEach((s) => sectionObserver.observe(s))

    return () => {
      heroObserver.disconnect()
      sectionObserver.disconnect()
    }
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 px-5 md:px-8 py-5 flex items-center justify-start transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
    </header>
  )
}
