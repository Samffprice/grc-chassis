'use client'

import { useEffect, useRef, useState } from 'react'
import ScrollAnimationContent from './ScrollAnimationContent'

interface ProductBuildAnimationProps {
  className?: string
}

export default function ProductBuildAnimation({ className = '' }: ProductBuildAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)


  // Preload all animation frames
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises: Promise<HTMLImageElement>[] = []
      
      // Load frames 0089 to 0183 (95 frames total)
      for (let i = 89; i <= 183; i++) {
        const frameNumber = i.toString().padStart(4, '0')
        const promise = new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve(img)
          img.onerror = reject
          img.src = `/WireAnimation/${frameNumber}.webp`
        })
        imagePromises.push(promise)
      }

      try {
        const loadedImages = await Promise.all(imagePromises)
        setImages(loadedImages)
        setImagesLoaded(true)
        setLoadingProgress(100)
      } catch (error) {
        console.error('Error loading animation frames:', error)
      }
    }

    loadImages()

    // Track loading progress
    let loadedCount = 0
    const totalFrames = 95
    
    for (let i = 89; i <= 183; i++) {
      const frameNumber = i.toString().padStart(4, '0')
      const img = new Image()
      img.onload = () => {
        loadedCount++
        setLoadingProgress(Math.round((loadedCount / totalFrames) * 100))
      }
      img.src = `/WireAnimation/${frameNumber}.webp`
    }
  }, [])



  if (!imagesLoaded) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 text-sm">Loading Animation</p>
          <p className="text-purple-400 text-xs mt-1">{loadingProgress}%</p>
        </div>
      </div>
    )
  }

  // Render the scroll animation content only after images are loaded
  return <ScrollAnimationContent images={images} canvasRef={canvasRef} />
}
