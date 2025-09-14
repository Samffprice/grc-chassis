'use client'

import { useApp } from '@/context/AppContext'
import { levelToHexLabel } from '@/utils/anodize'
import Image from 'next/image'

export default function CurrentColorDisplay() {
  const { anodizeLevel } = useApp()
  const { hex, label, voltage } = levelToHexLabel(anodizeLevel)

  return (
    <div className="frame-luxe rounded-2xl overflow-hidden">
      {/* Product image with color overlay */}
      <div className="relative aspect-square">
        <Image
          src="/full_render.webp"
          alt="Titanium chassis"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Color overlay */}
        <div
          className="absolute inset-0 mix-blend-multiply opacity-60"
          style={{ backgroundColor: hex }}
        />
      </div>
      
      {/* Color info */}
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-4">
          <div
            className="rounded-lg border border-white/15 w-12 h-12 flex-shrink-0"
            style={{ backgroundColor: hex, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -6px 12px rgba(0,0,0,0.35)' }}
          />
          <div>
            <div className="heading-luxe text-[18px] font-extrabold">{label}</div>
            <div className="price-note mt-1">~ {voltage} V</div>
            <div className="copy-luxe mt-2 text-[13px]">Titanium anodize approximation</div>
          </div>
        </div>
      </div>
    </div>
  )
}
