'use client'

import { useEffect, useState } from 'react'
import ProductBuildAnimation from './ProductBuildAnimation'

export default function ProductBuildAnimationWrapper() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 text-sm">Loading Animation</p>
        </div>
      </div>
    )
  }

  return <ProductBuildAnimation />
}
