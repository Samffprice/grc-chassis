'use client'

import { useApp } from '@/context/AppContext'
import Image from 'next/image'

export default function HeroSection() {
  const { inventoryCount } = useApp()

  const scrollToId = (id: string) => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const remainingDigits = String(Math.max(0, Math.min(50, inventoryCount))).padStart(2, '0')

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 z-0">
        {/* Deep gradient base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0C0C] via-[#111213] to-[#0A0A0A]" />
        
        {/* Hero wireframe image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-4xl opacity-[0.15]">
            <Image
              src="/hero_wire.png"
              alt="Titanium chassis wireframe"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        
        {/* Vignette overlay */}
        <div className="absolute inset-0 vignette" />
        
        {/* Subtle engineering grid */}
        <div className="absolute inset-0 bg-grid-overlay opacity-[0.04]" />
        
        {/* Soft radial highlight */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[58%] w-[1200px] h-[1200px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 25%, transparent 55%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-3 mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
          <span className="text-[12px] tracking-[0.32em] text-white/60 uppercase">Serialized Edition • 50 Only</span>
          <span className="hidden sm:block w-12 h-px bg-white/[0.18]" />
        </div>

        {/* Headline */}
        <h1 className="text-[44px] md:text-[68px] leading-[1.04] font-extrabold tracking-[-0.02em] text-[#F2F2F0] mb-4">
          Perfection is Non‑Negotiable.
        </h1>

        {/* Subheadline */}
        <p className="text-[18px] md:text-[20px] text-white/70 mb-12 max-w-2xl mx-auto">
          The Titanium Chassis. Fifty serialized units, machined from American titanium.
        </p>

        {/* Counter Card */}
        <div className="mb-14">
          <div className="inline-flex flex-col items-center rounded-2xl px-8 py-6 luxe-card">
            <p className="text-[11px] tracking-[0.28em] text-white/50 mb-3 uppercase">Units Remaining</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {remainingDigits.split('').map((d, i) => (
                  <span key={i} className="digit-luxe text-[28px] font-mono font-bold">{d}</span>
                ))}
              </div>
              <span className="text-white/40 text-2xl font-mono">/</span>
              <span className="text-white/40 text-2xl font-mono">50</span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => scrollToId('conversion-section')} className="btn-primary-luxe">
            Reserve Your Serial
          </button>
          <button onClick={() => scrollToId('proof')} className="btn-ghost-luxe">
            Explore Engineering
          </button>
        </div>
      </div>
    </section>
  )
}
