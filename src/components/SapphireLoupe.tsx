'use client'

import { useApp } from '@/context/AppContext'
import { useEffect, useMemo, useRef, useState } from 'react'

const ANODIZE_GRADIENT = 'linear-gradient(90deg, #6E4AAE 0%, #946BD9 10%, #C38EE8 18%, #E5A0E0 24%, #FFB3C7 30%, #FFD08A 40%, #FDCB6E 45%, #F6AA6E 50%, #A7C4FF 60%, #6EA0FF 70%, #3C75FF 80%, #355ECC 88%, #2A4D9F 100%)'

export default function SapphireLoupe() {
  const { anodizeLevel, setAnodizeLevel } = useApp()
  const plateRef = useRef<HTMLDivElement | null>(null)
  const [lensPos, setLensPos] = useState<{x: number; y: number}>({ x: 0.35, y: 0.5 }) // normalized
  const draggingRef = useRef(false)

  // Keep spectrum aligned to global anodizeLevel horizontally
  useEffect(() => {
    setLensPos(p => ({ ...p, x: anodizeLevel }))
  }, [anodizeLevel])

  const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

  const moveFromClient = (clientX: number, clientY: number) => {
    if (!plateRef.current) return
    const rect = plateRef.current.getBoundingClientRect()
    const x = clamp01((clientX - rect.left) / rect.width)
    const y = clamp01((clientY - rect.top) / rect.height)
    setLensPos({ x, y })
    setAnodizeLevel(x)
  }

  const onDown = (e: React.MouseEvent<HTMLDivElement>) => { draggingRef.current = true; moveFromClient(e.clientX, e.clientY) }
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => { if (draggingRef.current) moveFromClient(e.clientX, e.clientY) }
  const onUp = () => { draggingRef.current = false }
  const onLeave = () => { draggingRef.current = false }

  // Lens pixel position
  const lensSize = 180
  const lensTranslate = {
    left: `calc(${Math.round(lensPos.x * 100)}% - ${lensSize/2}px)`,
    top: `calc(${Math.round(lensPos.y * 100)}% - ${lensSize/2}px)`
  }

  // Parallax for lens refraction: slight offset of spectrum
  const parallaxX = (lensPos.x - 0.5) * 12
  const parallaxY = (lensPos.y - 0.5) * 12

  return (
    <div className="frame-luxe rounded-2xl p-6 md:p-8">
      <div className="loupe-plate" ref={plateRef} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onLeave}>
        {/* Brushed metal base */}
        <div className="loupe-brush" />
        {/* Subsurface spectrum (dim) */}
        <div className="loupe-spectrum" style={{ backgroundImage: ANODIZE_GRADIENT }} />
        {/* Lens */}
        <div className="loupe-lens" style={{ ...lensTranslate }}>
          <div className="loupe-glass" />
          <div className="loupe-surface" />
          {/* Refracted spectrum sample inside lens */}
          <div
            className="loupe-refract"
            style={{
              backgroundImage: ANODIZE_GRADIENT,
              backgroundSize: '220% 120%',
              backgroundPosition: `calc(${Math.round(lensPos.x * 100)}% + ${parallaxX}px) calc(${Math.round(lensPos.y * 100)}% + ${parallaxY}px)`,
            }}
          />
          {/* Chromatic edges */}
          <div className="loupe-chroma red" />
          <div className="loupe-chroma blue" />
          {/* Shadow */}
          <div className="loupe-shadow" />
        </div>
      </div>
      <div className="text-center mt-5">
        <div className="heading-luxe text-[18px] font-extrabold">Sapphire Loupe</div>
        <div className="price-note mt-1">Drag the glass to inspect anodize colors</div>
      </div>
    </div>
  )
}
