import { useState } from 'react'
import emailjs from '@emailjs/browser'
import FadeIn from './FadeIn'

const SERVICE_ID = 'service_er4zhav'
const TEMPLATE_ID = 'template_d4kkrcw'
const PUBLIC_KEY = '98PuJBY_QaQVD8RP1'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError('')

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          to_email: 'devvratalewa@gmail.com',
        },
        PUBLIC_KEY
      )
      setSent(true)
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setError('Failed to send. Please try again or email directly.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {/* ── Contact Section ── */}
      <section id="contact" className="relative text-white min-h-screen flex items-center" style={{ background: 'linear-gradient(180deg, #0a1628 0%, #050d1a 60%, #0a0a0a 100%)' }}>
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32 w-full">
          <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            {/* Left: heading + info */}
            <div>
              <p className="text-[10px] md:text-xs tracking-[0.3em] text-neutral-400 uppercase font-medium mb-4">
                Don't be shy. Come say hi.
              </p>
              <h2
                className="font-black uppercase leading-[0.9] tracking-tight mb-10"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
              >
                Let's Build<br />Something Cool<br />Together<span className="text-[#60a5fa]">!</span>
              </h2>

              {/* Social icons */}
              <div className="flex gap-5">
                <a href="https://github.com/devvrat16" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
                <a href="https://www.linkedin.com/in/dev-vrat-9a0781276/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://www.instagram.com/dev_vrat16/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://x.com/DevVrat1601" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>

            {/* Right: form */}
            <div className="flex flex-col justify-center">
              {sent ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">✓</div>
                  <p className="text-lg font-bold mb-2">Message Sent!</p>
                  <p className="text-sm text-neutral-400">I'll get back to you soon.</p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-6 text-xs text-neutral-500 hover:text-white transition-colors tracking-widest uppercase"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-0">
                  <div className="py-5 border-b border-white/15">
                    <label className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase block mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full bg-transparent py-1 text-sm text-white placeholder:text-neutral-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="py-5 border-b border-white/15">
                    <label className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase block mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full bg-transparent py-1 text-sm text-white placeholder:text-neutral-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="py-5 border-b border-white/15">
                    <label className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase block mb-2">Message</label>
                    <textarea
                      rows="4"
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell me about your project..."
                      className="w-full bg-transparent py-1 text-sm text-white placeholder:text-neutral-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-xs mt-3">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="mt-12 inline-flex items-center gap-3 bg-white text-[#09090b] px-8 py-4 text-xs font-black tracking-widest uppercase hover:bg-neutral-200 transition-colors disabled:opacity-50"
                  >
                    {sending ? 'Sending...' : 'Send Message'}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="stroke-current">
                      <path d="M3 11L11 3M11 3H5M11 3V9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative bg-[#0a0a0a] text-white flex flex-col justify-between">
        <div className="border-t border-white/10" />

        <div className="px-6 md:px-12 lg:px-20 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-5 md:gap-8">
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="text-[10px] md:text-xs text-neutral-500 tracking-[0.2em] uppercase font-medium hover:text-white transition-colors"
            >
              Home
            </a>
            {['About', 'Projects', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[10px] md:text-xs text-neutral-500 tracking-[0.2em] uppercase font-medium hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex gap-4">
            <a href="https://github.com/devvrat16" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/dev-vrat-9a0781276/" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://www.instagram.com/dev_vrat16/" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://x.com/DevVrat1601" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>

        <div className="border-t border-white/10" />

        <div className="px-6 md:px-12 lg:px-20 py-4">
          <p className="text-[10px] md:text-xs text-neutral-600 tracking-wide">
            © 2026 Dev Vrat — All rights reserved
          </p>
        </div>
      </footer>
    </>
  )
}
