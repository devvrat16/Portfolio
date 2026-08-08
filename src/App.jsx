import { useState, useCallback } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Portfolio from './components/Portfolio'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Certifications from './components/Certifications'
import Contact from './components/Contact'

export default function App() {
  const [inverted, setInverted] = useState(false)
  const toggle = useCallback(() => setInverted(v => !v), [])

  return (
    <>
      <div
        className="min-h-screen bg-[#0a0a0a]"
        style={inverted ? { filter: 'invert(1) hue-rotate(180deg)' } : undefined}
      >
        <Header />
        <Hero inverted={inverted} />
        <Portfolio inverted={inverted} onToggle={toggle} />
        <About />
        <Skills />
        <Projects />
        <Certifications />
        <Contact />
      </div>
    </>
  )
}
