"use client"

import { useApp } from '@/context/AppContext'
import { levelToVoltage, generateAnodizeGradient } from '@/utils/anodize'
import { useMemo, useRef, useState, useEffect } from 'react'

type Mode = 'regular' | 'anodized'

// Key snap points based on popular anodize colors: Bronze (15V), Purple (25V), Yellow (40V), Gold (65V), Hot Pink (75V)
const SNAP_POINTS = [15/110, 25/110, 40/110, 65/110, 75/110]

function clamp01(v: number) { return Math.max(0, Math.min(1, v)) }

export default function SimpleFinishSelector() {
  const { selectedFinish, setSelectedFinish, anodizeLevel, setAnodizeLevel } = useApp()
  const mode: Mode = selectedFinish === 'raw-machined' ? 'regular' : 'anodized'
  const railRef = useRef<HTMLDivElement | null>(null)
  const draggingRef = useRef(false)
  const [snapHint, setSnapHint] = useState<number | null>(null)

  const selectMode = (m: Mode) => {
    if (m === 'regular') { setSelectedFinish('raw-machined'); setAnodizeLevel(0) }
    else { setSelectedFinish('titanium-purple') }
  }

  const setFromClientX = (clientX: number) => {
    if (!railRef.current) return
    const rect = railRef.current.getBoundingClientRect()
    const t = clamp01((clientX - rect.left) / rect.width)
    setAnodizeLevel(t)
    const near = SNAP_POINTS.reduce((a, b) => Math.abs(b - t) < Math.abs((a ?? b) - t) ? b : (a ?? b), undefined as number | undefined)
    if (near !== undefined && Math.abs(near - t) < 0.03) setSnapHint(near); else setSnapHint(null)
  }

  const onDown = (e: React.MouseEvent<HTMLDivElement>) => {
    draggingRef.current = true
    setFromClientX(e.clientX)
  }

  // Global mouse handlers for smooth dragging
  useEffect(() => {
    const onGlobalMove = (e: MouseEvent) => {
      if (draggingRef.current) setFromClientX(e.clientX)
    }
    const onGlobalUp = () => {
      if (draggingRef.current) {
        if (snapHint != null) setAnodizeLevel(snapHint)
        draggingRef.current = false
        setSnapHint(null)
      }
    }

    document.addEventListener('mousemove', onGlobalMove)
    document.addEventListener('mouseup', onGlobalUp)
    return () => {
      document.removeEventListener('mousemove', onGlobalMove)
      document.removeEventListener('mouseup', onGlobalUp)
    }
  }, [snapHint, setAnodizeLevel])

  const voltage = useMemo(() => levelToVoltage(anodizeLevel), [anodizeLevel])

  return (
    <div className="frame-luxe rounded-2xl p-6 md:p-8">
      <div className="heading-luxe text-[18px] font-extrabold mb-4">Finish</div>

      {/* Mode Toggle */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        <button
          className={`selector-card ${mode === 'regular' ? 'selected' : ''}`}
          onClick={() => selectMode('regular')}
        >
          <span className="selector-dot" style={{ backgroundImage: 'linear-gradient(135deg, #B5B5B5, #8E8E8B)' }} />
          <span className="text-left">
            <span className="text-white/90 font-medium block">Regular</span>
            <span className="text-white/45 text-[12px] tracking-wide">Raw machined titanium</span>
          </span>
        </button>
        <button
          className={`selector-card ${mode === 'anodized' ? 'selected' : ''}`}
          onClick={() => selectMode('anodized')}
        >
          <span className="selector-dot" style={{ backgroundImage: 'linear-gradient(135deg, #9B59B6, #3D7BDA)' }} />
          <span className="text-left">
            <span className="text-white/90 font-medium block">Anodized</span>
            <span className="text-white/45 text-[12px] tracking-wide">Choose color</span>
          </span>
        </button>
      </div>

      {/* Spectrum (only when anodized) */}
      {mode === 'anodized' && (
        <div>
          <div className="price-note mb-2">~ {voltage} V</div>
          <div
            ref={railRef}
            className="spectrum-rail-luxe"
            onMouseDown={onDown}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={110}
            aria-valuenow={voltage}
            aria-label="Anodize voltage"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') setAnodizeLevel(v => clamp01(v - 1/110))
              if (e.key === 'ArrowRight') setAnodizeLevel(v => clamp01(v + 1/110))
            }}
          >
            <div className="spectrum-knob" style={{ left: `calc(${Math.round(anodizeLevel * 100)}% - 10px)` }} />
            {/* Snap ticks */}
            {SNAP_POINTS.map((p, i) => (
              <div key={i} className="snap-tick" style={{ left: `${p * 100}%` }} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
