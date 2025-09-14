'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ScrollAnimationContentProps {
  images: HTMLImageElement[]
  canvasRef: React.RefObject<HTMLCanvasElement | null>
}

export default function ScrollAnimationContent({ images, canvasRef }: ScrollAnimationContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize scroll tracking (safe since this component only renders client-side after hydration)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Transform scroll progress to frame number (0-94 for 95 frames)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, 94])

  // Animation text blocks data
  const textBlocks = [
    {
      title: "Titanium Foundation",
      description: "Starting with aerospace-grade titanium, each chassis begins as raw material destined for perfection.",
      progress: [0.06, 0.22]
    },
    {
      title: "Precision Machining",
      description: "CNC machined to tolerances measured in microns. Every curve, every angle calculated for optimal performance.",
      progress: [0.26, 0.46]
    },
    {
      title: "Structural Integration",
      description: "Advanced engineering creates a monocoque structure that's both lightweight and incredibly rigid.",
      progress: [0.50, 0.66]
    },
    {
      title: "Surface Preparation",
      description: "Multiple stages of finishing prepare the titanium for its final anodized coating.",
      progress: [0.70, 0.86]
    },
    {
      title: "Final Assembly",
      description: "Hand-assembled with precision components. Each chassis is individually serialized and tested.",
      progress: [0.88, 0.98]
    }
  ]

  // Create motion values for each text block at component level
  const textBlock0Opacity = useTransform(scrollYProgress, [0.06, 0.14, 0.14, 0.22], [0, 1, 1, 0])
  const textBlock0Y = useTransform(scrollYProgress, [0.06, 0.14, 0.14, 0.22], [60, 0, 0, -60])
  
  const textBlock1Opacity = useTransform(scrollYProgress, [0.26, 0.34, 0.38, 0.46], [0, 1, 1, 0])
  const textBlock1Y = useTransform(scrollYProgress, [0.26, 0.34, 0.38, 0.46], [60, 0, 0, -60])
  
  const textBlock2Opacity = useTransform(scrollYProgress, [0.50, 0.58, 0.58, 0.66], [0, 1, 1, 0])
  const textBlock2Y = useTransform(scrollYProgress, [0.50, 0.58, 0.58, 0.66], [60, 0, 0, -60])
  
  const textBlock3Opacity = useTransform(scrollYProgress, [0.70, 0.78, 0.78, 0.86], [0, 1, 1, 0])
  const textBlock3Y = useTransform(scrollYProgress, [0.70, 0.78, 0.78, 0.86], [60, 0, 0, -60])
  
  const textBlock4Opacity = useTransform(scrollYProgress, [0.88, 0.96, 0.90, 0.98], [0, 1, 1, 0])
  const textBlock4Y = useTransform(scrollYProgress, [0.88, 0.96, 0.90, 0.98], [60, 0, 0, -60])

  const textBlockAnimations = [
    { opacity: textBlock0Opacity, y: textBlock0Y },
    { opacity: textBlock1Opacity, y: textBlock1Y },
    { opacity: textBlock2Opacity, y: textBlock2Y },
    { opacity: textBlock3Opacity, y: textBlock3Y },
    { opacity: textBlock4Opacity, y: textBlock4Y },
  ]

  // Progress indicator animations
  const progressOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])
  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  // Draw current frame on canvas
  useEffect(() => {
    if (!canvasRef.current || images.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Subscribe to frame changes
    const unsubscribe = frameIndex.onChange((latest) => {
      const currentFrame = Math.round(Math.max(0, Math.min(94, latest)))
      const currentImage = images[currentFrame]
      
      if (currentImage) {
        // Get the display dimensions (not the scaled canvas dimensions)
        const rect = canvas.getBoundingClientRect()
        const displayWidth = rect.width
        const displayHeight = rect.height
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // Calculate dimensions to fit entire image (object-contain behavior)
        const canvasAspect = displayWidth / displayHeight
        const imageAspect = currentImage.width / currentImage.height
        
        let drawWidth, drawHeight, drawX, drawY
        
        if (imageAspect > canvasAspect) {
          // Image is wider than canvas - fit by width
          drawWidth = displayWidth
          drawHeight = displayWidth / imageAspect
          drawX = 0
          drawY = (displayHeight - drawHeight) / 2
        } else {
          // Image is taller than canvas - fit by height
          drawHeight = displayHeight
          drawWidth = displayHeight * imageAspect
          drawX = (displayWidth - drawWidth) / 2
          drawY = 0
        }
        
        // Draw the image using display dimensions
        ctx.drawImage(currentImage, drawX, drawY, drawWidth, drawHeight)
      }
    })

    return unsubscribe
  }, [images, frameIndex, canvasRef])

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return
      
      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(dpr, dpr)
      }
      
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [canvasRef])

  return (
    <div 
      ref={containerRef}
      className="relative mt-24 mb-24 md:mt-40 md:mb-40"
      style={{ height: '400vh' }} // 4x viewport height for scroll duration
    >
      {/* Sticky animation container */}
      <div className="sticky top-0 h-screen flex flex-col md:flex-row bg-[#0C0C0C] isolate border-y border-white/5">
        {/* Animation canvas - left side */}
        <div className="w-full md:w-1/2 h-[60vh] md:h-full flex items-center justify-center bg-gradient-to-br from-[#0C0C0C] to-[#1A1A1A] p-4 md:p-6">
          <div className="relative w-full h-full max-w-full aspect-square md:aspect-auto">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
            
            {/* Subtle overlay for premium feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Text blocks - right side */}
        <div className="w-full md:w-1/2 min-h-[40vh] md:h-full flex flex-col justify-center px-6 md:px-8 lg:px-12 py-8 md:py-0">
          {textBlocks.map((block, index) => (
            <motion.div
              key={index}
              className="mb-16 last:mb-0"
              style={{
                opacity: textBlockAnimations[index].opacity,
                y: textBlockAnimations[index].y
              }}
            >
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 tracking-tight">
                {block.title}
              </h3>
              <p className="text-white/70 text-lg leading-relaxed max-w-md">
                {block.description}
              </p>
              
              {/* Progress indicator */}
              <div className="mt-6 w-12 h-px bg-gradient-to-r from-purple-500 to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Progress indicator */}
      <motion.div
        className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50"
        style={{
          opacity: progressOpacity
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-px h-20 bg-white/20 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-purple-500 to-purple-400"
              style={{
                height: progressHeight
              }}
            />
          </div>
          <span className="text-xs text-white/40 font-mono">
            {Math.round(frameIndex.get())}/94
          </span>
        </div>
      </motion.div>
    </div>
  )
}
