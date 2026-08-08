import FadeIn from './FadeIn'

export default function About() {
  return (
    <section id="about" className="relative bg-[#f4f4f5] text-[#09090b] flex items-center">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-20 w-full">
        <FadeIn>
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 mb-4 font-medium">
              About Me
            </p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] mb-6">
              Hi, I'm<br />
              <span className="text-neutral-400">Dev Vrat.</span>
            </h2>
            <p className="text-base md:text-lg text-neutral-500 leading-relaxed font-light mb-8">
              I'm a developer and designer focused on crafting digital experiences
              that feel intentional, minimal, and refined. I believe in clean code,
              bold typography, and letting the work speak for itself.
            </p>

            <div className="space-y-3 mb-10">
              <div className="flex items-center gap-3">
                <span className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase w-16">Role</span>
                <span className="text-sm text-neutral-600 font-medium">Full Stack Developer</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase w-16">Stack</span>
                <span className="text-sm text-neutral-600 font-medium">React · Node.js · Python</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] tracking-[0.2em] text-neutral-400 uppercase w-16">Based in</span>
                <span className="text-sm text-neutral-600 font-medium">India</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:hello@devvrat.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#09090b] text-white text-xs tracking-widest uppercase font-medium rounded-full hover:bg-neutral-800 transition-colors"
              >
                Email
                <span className="text-neutral-500">→</span>
              </a>
              <a
                href="https://github.com/devvrat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-neutral-300 text-neutral-600 text-xs tracking-widest uppercase font-medium rounded-full hover:border-neutral-900 hover:text-[#09090b] transition-colors"
              >
                GitHub
                <span className="text-neutral-400">↗</span>
              </a>
              <a
                href="https://linkedin.com/in/devvrat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-neutral-300 text-neutral-600 text-xs tracking-widest uppercase font-medium rounded-full hover:border-neutral-900 hover:text-[#09090b] transition-colors"
              >
                LinkedIn
                <span className="text-neutral-400">↗</span>
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
