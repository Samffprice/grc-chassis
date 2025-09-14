'use client'

import { useApp } from '@/context/AppContext'
import { useEffect, useMemo, useRef, useState } from 'react'

interface Finish {
  id: string
  name: string
  previewGradient: string
  swatchGradient: string
}

const FINISHES: Finish[] = [
  {
    id: 'titanium-purple',
    name: 'Titanium Purple',
    previewGradient: 'linear-gradient(135deg, rgba(129,108,174,0.95) 0%, rgba(62,55,80,0.95) 100%)',
    swatchGradient: 'radial-gradient(circle at 35% 30%, #D6CCF0 0%, rgba(214,204,240,0.6) 12%, rgba(129,108,174,1) 28%, rgba(80,62,112,1) 55%, rgba(38,30,48,1) 100%)'
  },
  {
    id: 'raw-machined',
    name: 'Raw Machined',
    previewGradient: 'linear-gradient(135deg, rgba(217,217,215,0.95) 0%, rgba(142,142,139,0.95) 100%)',
    swatchGradient: 'radial-gradient(circle at 35% 30%, #FFFFFF 0%, rgba(255,255,255,0.6) 12%, #D9D9D7 28%, #9A9A97 55%, #2A2A2A 100%)'
  },
  {
    id: 'space-black',
    name: 'Space Black',
    previewGradient: 'linear-gradient(135deg, rgba(42,42,42,0.95) 0%, rgba(13,13,13,0.95) 100%)',
    swatchGradient: 'radial-gradient(circle at 35% 30%, #D0D0D0 0%, rgba(160,160,160,0.35) 18%, #2A2A2A 38%, #0F0F0F 70%, #050505 100%)'
  },
]

// Titanium anodize palette (purple → pink/yellow → blue)
const ANODIZE_GRADIENT = 'linear-gradient(90deg, #6E4AAE 0%, #946BD9 10%, #C38EE8 18%, #E5A0E0 24%, #FFB3C7 30%, #FFD08A 40%, #FDCB6E 45%, #F6AA6E 50%, #A7C4FF 60%, #6EA0FF 70%, #3C75FF 80%, #355ECC 88%, #2A4D9F 100%)'

const STAGES = [
  { t: 0.12, label: 'Violet' },
  { t: 0.42, label: 'Bronze' },
  { t: 0.74, label: 'Royal Blue' },
]

function clamp01(v: number) { return Math.max(0, Math.min(1, v)) }

export default function AnodizedSelector() {
  const { selectedFinish, setSelectedFinish } = useApp()

  const [tilt, setTilt] = useState<{rx: number; ry: number}>({ rx: 0, ry: 0 })
  const [sweep, setSweep] = useState(0.35) // target 0..1
  const [displaySweep, setDisplaySweep] = useState(0.35)
  const [auto, setAuto] = useState(true)
  const pillRef = useRef<HTMLDivElement | null>(null)
  const draggingRef = useRef(false)
  const [snapLabel, setSnapLabel] = useState<string | null>(null)

  const current = useMemo(() => FINISHES.find(f => f.id === selectedFinish) || FINISHES[0], [selectedFinish])

  // Tilt
  const onMovePlate = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const ry = (px - 0.5) * 6
    const rx = (0.5 - py) * 6
    setTilt({ rx, ry })
  }
  const onLeavePlate = () => setTilt({ rx: 0, ry: 0 })

  // Auto sweep (gentle)
  useEffect(() => {
    if (!auto) return
    let raf = 0
    const step = () => {
      setSweep(prev => {
        const speed = 0.0012
        let next = prev + speed
        if (next > 0.98) next = 0.02
        return next
      })
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [auto])

  // Inertial display
  useEffect(() => {
    let raf = 0
    const step = () => {
      setDisplaySweep(prev => prev + (sweep - prev) * 0.12)
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [sweep])

  // Drag pill to scrub spectrum
  const setSweepFromPill = (clientX: number) => {
    if (!pillRef.current) return
    const rect = pillRef.current.getBoundingClientRect()
    const t = clamp01((clientX - rect.left) / rect.width)
    setAuto(false)
    setSweep(t)
    // Snap hint
    const near = STAGES.find(s => Math.abs(s.t - t) < 0.03)
    setSnapLabel(near ? near.label : null)
  }

  const onPillMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    draggingRef.current = true
    setSweepFromPill(e.clientX)
  }
  const onPillMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    setSweepFromPill(e.clientX)
  }
  const onPillMouseUp = () => {
    if (snapLabel) {
      const stage = STAGES.find(s => s.label === snapLabel)
      if (stage) setSweep(stage.t)
    }
    draggingRef.current = false
    setSnapLabel(null)
  }
  const onPillMouseLeave = () => { draggingRef.current = false; setSnapLabel(null) }

  return (
    <div className="space-y-6">
      {/* Brushed plate with pill and spectrum overlay */}
      <div
        className="brushed-plate frame-luxe rounded-2xl p-6 md:p-8 relative overflow-hidden will-change-transform"
        onMouseMove={onMovePlate}
        onMouseLeave={onLeavePlate}
        style={{
          transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: 'transform .12s ease-out',
        }}
      >
        <div className="absolute inset-0 pointer-events-none sheen-soft" />
        <div className="flex items-center justify-center py-10 md:py-14">
          <div
            ref={pillRef}
            className="ano-pill relative overflow-hidden pill-scrub"
            onMouseDown={onPillMouseDown}
            onMouseMove={onPillMouseMove}
            onMouseUp={onPillMouseUp}
            onMouseLeave={onPillMouseLeave}
          >
            {/* Base finish shading */}
            <div className="ano-layer" style={{ backgroundImage: current.previewGradient }} />
            {/* Anodize spectrum overlay */}
            <div
              className="ano-layer ano-spectrum"
              style={{
                backgroundImage: ANODIZE_GRADIENT,
                backgroundSize: '200% 100%',
                backgroundPosition: `${Math.round(displaySweep * 100)}% 0%`,
                opacity: 0.85,
              }}
            />
            {/* Internal track and knob */}
            <div className="ano-track" />
            <div className="ano-knob" style={{ left: `calc(${Math.round(displaySweep * 100)}% - 10px)` }} />
            {/* Gloss */}
            <div className="ano-layer ano-gloss" />
          </div>
        </div>
        <div className="text-center">
          <div className="heading-luxe text-[18px] font-extrabold">{current.name}</div>
          <div className="price-note mt-1">Anodized Spectrum</div>
        </div>
      </div>

      {/* Stage chips */}
      <div className="flex flex-wrap items-center gap-2">
        {STAGES.map((s, idx) => (
          <button
            key={idx}
            className={`chip-luxe ${Math.abs(displaySweep - s.t) < 0.03 ? 'active' : ''}`}
            onClick={() => { setAuto(false); setSweep(s.t) }}
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
            {auto ? 'Pause Sweep' : 'Auto Sweep'}
          </button>
        </div>
      </div>

      {/* Cabochon swatches */}
      <div className="grid grid-cols-3 gap-3">
        {FINISHES.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFinish(f.id)}
            aria-pressed={selectedFinish === f.id}
            className={`cabochon-wrap ${selectedFinish === f.id ? 'selected' : ''}`}
            title={f.name}
          >
            <span className="cabochon" style={{ backgroundImage: f.swatchGradient }} />
            <span className="swatch-name">{f.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
