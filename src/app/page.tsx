'use client'

import dynamic from 'next/dynamic'
import HeroSection from '@/components/HeroSection'
import ProofSection from '@/components/ProofSection'
import ConversionSection from '@/components/ConversionSection'
import FooterSection from '@/components/FooterSection'

// Dynamically import the animation wrapper to prevent SSR issues
const ProductBuildAnimationWrapper = dynamic(() => import('@/components/ProductBuildAnimationWrapper'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/60 text-sm">Loading Animation</p>
      </div>
    </div>
  )
})

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white">
      <HeroSection />
      <ProductBuildAnimationWrapper />
      <ProofSection />
      <ConversionSection />
      <FooterSection />
    </main>
  )
}