'use client'

import { useApp } from '@/context/AppContext'
import { useState } from 'react'
import SimpleFinishSelector from './SimpleFinishSelector'
import CurrentColorDisplay from './CurrentColorDisplay'


export default function ConversionSection() {
  const { selectedFinish, inventoryCount, setIsLoading, anodizeLevel } = useApp()
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePreOrder = async () => {
    setIsProcessing(true)
    setIsLoading(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ finish: selectedFinish, anodize_t: anodizeLevel }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Checkout API error:', errorData)
        throw new Error(errorData.error || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert(`There was an error processing your request: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
    } finally {
      setIsProcessing(false)
      setIsLoading(false)
    }
  }

  return (
    <section id="conversion-section" className="py-24 px-6 bg-gradient-to-b from-[#101010] to-[#080808]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="section-eyebrow-luxe justify-center mx-auto mb-5">
            <span className="dot" />
            <span className="label">Pre‑Order</span>
            <span className="rule" />
          </div>
          <h2 className="heading-luxe text-[34px] md:text-[42px] font-extrabold mb-3">Secure Your Chassis</h2>
          <p className="copy-luxe text-[16px] md:text-[18px]">Your serial number is assigned by order of purchase (1–50).</p>
        </div>

        {/* Your Serial Counter */}
        <div className="mb-12 text-center">
          <div className="inline-flex flex-col items-center rounded-2xl px-8 py-6 luxe-card">
            <p className="text-[11px] tracking-[0.28em] text-white/50 mb-3 uppercase">Your Serial</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {String(Math.max(1, 51 - inventoryCount)).padStart(2, '0').split('').map((d, i) => (
                  <span key={i} className="digit-luxe text-[28px] font-mono font-bold">{d}</span>
                ))}
              </div>
              <span className="text-white/40 text-2xl font-mono">/</span>
              <span className="text-white/40 text-2xl font-mono">50</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-12 items-start">
          {/* Simple color display */}
          <div className="flex justify-center items-start">
            <div className="w-full max-w-[420px]">
              <CurrentColorDisplay />
            </div>
          </div>

          {/* Minimal selector */}
          <div>
            <SimpleFinishSelector />

            <div className="frame-luxe rounded-xl p-6 mt-8">
              <h4 className="heading-luxe text-[18px] font-extrabold mb-2">Step 2: Personalize Your Serial</h4>
              <p className="copy-luxe text-[14px] leading-relaxed">
                After your reservation is confirmed, our team will contact you to coordinate your complimentary custom engraving (name, logo, or team).
              </p>
            </div>

            <div className="text-center mt-8">
              <div className="price-luxe text-[30px] font-extrabold mb-2">$600</div>
              <div className="price-note mb-5">Full Payment Required</div>
              <button
                onClick={handlePreOrder}
                disabled={isProcessing || inventoryCount <= 0}
                className={`btn-primary-luxe w-full ${isProcessing || inventoryCount <= 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? 'Processing…' : inventoryCount <= 0 ? 'Sold Out' : 'Pre‑Order Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
