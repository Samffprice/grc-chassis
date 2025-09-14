'use client'

import { useApp } from '@/context/AppContext'
import { useEffect, useRef, useState } from 'react'

// Spectrum: purple → pink/yellow → blue
const ANODIZE_GRADIENT = 'linear-gradient(90deg, #6E4AAE 0%, #946BD9 10%, #C38EE8 18%, #E5A0E0 24%, #FFB3C7 30%, #FFD08A 40%, #FDCB6E 45%, #F6AA6E 50%, #A7C4FF 60%, #6EA0FF 70%, #3C75FF 80%, #355ECC 88%, #2A4D9F 100%)'
const STAGES = [
  { t: 0.12, label: 'Violet' },
  { t: 0.42, label: 'Bronze' },
  { t: 0.74, label: 'Royal Blue' },
]

function clamp01(v: number) { return Math.max(0, Math.min(1, v)) }

export default function AnodizeBath() {
  const { anodizeLevel, setAnodizeLevel } = useApp()
  const [displayT, setDisplayT] = useState(anodizeLevel)
  const [auto, setAuto] = useState(true)
  const vesselRef = useRef<HTMLDivElement | null>(null)
  const draggingRef = useRef(false)
  const [snapLabel, setSnapLabel] = useState<string | null>(null)
  const [rippleKey, setRippleKey] = useState(0)

  useEffect(() => setDisplayT(anodizeLevel), [anodizeLevel])

  // Auto flow
  useEffect(() => {
    if (!auto) return
    let raf = 0
    const step = () => {
      const speed = 0.0012
      let next = anodizeLevel + speed
      if (next > 0.98) next = 0.02
      setAnodizeLevel(next)
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [auto, anodizeLevel, setAnodizeLevel])

  // Inertial display
  useEffect(() => {
    let raf = 0
    const step = () => {
      setDisplayT(prev => prev + (anodizeLevel - prev) * 0.12)
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [anodizeLevel])

  const setLevelFromClientX = (clientX: number) => {
    if (!vesselRef.current) return
    const rect = vesselRef.current.getBoundingClientRect()
    const t = clamp01((clientX - rect.left) / rect.width)
    setAuto(false)
    setAnodizeLevel(t)
    const near = STAGES.find(s => Math.abs(s.t - t) < 0.03)
    setSnapLabel(near ? near.label : null)
  }

  const onDown = (e: React.MouseEvent<HTMLDivElement>) => { draggingRef.current = true; setLevelFromClientX(e.clientX) }
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => { if (draggingRef.current) setLevelFromClientX(e.clientX) }
  const onUp = () => {
    if (snapLabel) {
      const s = STAGES.find(x => x.label === snapLabel)
      if (s) { setAnodizeLevel(s.t); setRippleKey(k => k + 1) }
    }
    draggingRef.current = false
    setSnapLabel(null)
  }
  const onLeave = () => { draggingRef.current = false; setSnapLabel(null) }

  const levelPct = Math.round(displayT * 100)

  return (
    <div className="space-y-6">
      {/* Vessel */}
      <div className="vessel-luxe frame-luxe rounded-2xl p-6 md:p-8">
        <div
          ref={vesselRef}
          className="vessel-inner"
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onLeave}
          role="slider"
          aria-label="Anodize level"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={levelPct}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') { setAuto(false); setAnodizeLevel(clamp01(anodizeLevel - 0.03)) }
            if (e.key === 'ArrowRight') { setAuto(false); setAnodizeLevel(clamp01(anodizeLevel + 0.03)) }
          }}
        >
          {/* Caustic shimmer */}
          <div className="caustics" />

          {/* Titanium sample */}
          <div className="sample">
            <div className="sample-metal" />
            <div
              className="sample-anodize"
              style={{ backgroundImage: ANODIZE_GRADIENT, backgroundSize: '200% 100%', backgroundPosition: `${levelPct}% 0%`, opacity: 0.9 }}
            />
            <div className="sample-gloss" />
          </div>

          {/* Electrolyte fill */}
          <div className="electrolyte">
            <div className="electrolyte-fill" style={{ width: `${levelPct}%` }} />
            <div className="meniscus" style={{ left: `calc(${levelPct}% - 10px)` }} />
            {/* Rising bubbles near meniscus */}
            <div className="bubbles" style={{ left: `calc(${levelPct}% - 6px)` }} />
            {/* Ripple when snapping */}
            <div key={rippleKey} className="ripple" style={{ left: `calc(${levelPct}% - 24px)` }} />
          </div>

          {/* Tick rail */}
          <div className="bath-rail">
            <div className="bath-rail-bg" />
            <div className="bath-knob" style={{ left: `calc(${levelPct}% - 10px)` }} />
          </div>
        </div>

        <div className="text-center mt-6">
          <div className="heading-luxe text-[18px] font-extrabold">Anodize Bath</div>
          <div className="price-note mt-1">Level {levelPct}% — {snapLabel || 'Continuous'}</div>
        </div>
      </div>

      {/* Stage chips and control */}
      <div className="flex flex-wrap items-center gap-2">
        {STAGES.map((s, idx) => (
          <button
            key={idx}
            className={`chip-luxe ${Math.abs(displayT - s.t) < 0.03 ? 'active' : ''}`}
            onClick={() => { setAuto(false); setAnodizeLevel(s.t); setRippleKey(k => k + 1) }}
          >
            {s.label}
          </button>
        ))}
        <div className="ml-auto">
          <button
            type="button"
            className="btn-ghost-luxe"
            style={{ padding: '0.5rem 0.9rem', borderRadius: '0.5rem', fontSize: '12px' }}
            onClick={() => setAuto(a => !a)}
          >
            {auto ? 'Pause Flow' : 'Auto Flow'}
          </button>
        </div>
      </div>
    </div>
  )
}
