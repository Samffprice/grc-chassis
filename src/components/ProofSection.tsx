'use client'

import Image from 'next/image'

interface ProofModuleProps {
  headline: string
  body: string
  imageAlt: string
  imagePosition: 'left' | 'right'
  imageSrc: string
}

function ProofModule({ headline, body, imageAlt, imagePosition, imageSrc }: ProofModuleProps) {
  return (
    <div className={`flex flex-col ${imagePosition === 'left' ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20 mb-24`}>
      {/* Image */}
      <div className="flex-1">
        <div className="aspect-square rounded-xl frame-luxe overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 text-center lg:text-left">
        <h2 className="heading-luxe text-[30px] md:text-[40px] font-extrabold mb-5">
          {headline}
        </h2>
        <div className="rule-luxe mb-6" />
        <p className="copy-luxe text-[18px] leading-relaxed">
          {body}
        </p>
      </div>
    </div>
  )
}

export default function ProofSection() {
  const modules = [
    {
      headline: "Zero Compromise. Zero Vibration.",
      body: "Forged from aerospace-grade titanium, our chassis is engineered to dampen parasitic harmonics for a pure, predictable connection to your gyro.",
      imageAlt: "Titanium chassis wireframe detail",
      imagePosition: 'left' as const,
      imageSrc: "/wire_2_3.webp"
    },
    {
      headline: "A Perfect Replacement.",
      body: "Designed as a 1‑for‑1 direct swap for the Overdose GALM deck. No modification required.",
      imageAlt: "Complete chassis wireframe view",
      imagePosition: 'right' as const,
      imageSrc: "/wire_2_3_ren.webp"
    },
    {
      headline: "Engineered in America.",
      body: "Every chassis is machined, finished, and inspected in our facility. It doesn't ship unless it's perfect.",
      imageAlt: "Titanium chassis rendered finish",
      imagePosition: 'left' as const,
      imageSrc: "/full_render.webp"
    }
  ]

  return (
    <section id="proof" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="section-eyebrow-luxe justify-center mx-auto mb-5">
            <span className="dot" />
            <span className="label">The Proof</span>
            <span className="rule" />
          </div>
          <h2 className="heading-luxe text-[34px] md:text-[42px] font-extrabold">Precision Without Compromise</h2>
        </div>
        {modules.map((module, index) => (
          <ProofModule key={index} {...module} />
        ))}
      </div>
    </section>
  )
}
