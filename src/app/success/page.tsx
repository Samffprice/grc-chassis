import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-[#7F00FF] to-[#4A00E0] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Order Confirmed
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Thank you for your pre-order. Your titanium chassis has been reserved.
          </p>
        </div>

        <div className="bg-black/30 rounded-lg p-8 mb-8 text-left">
          <h2 className="text-2xl font-bold mb-4 text-white">What happens next?</h2>
          <div className="space-y-4 text-gray-300">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#7F00FF] rounded-full flex items-center justify-center mt-0.5 text-sm font-bold text-white">
                1
              </div>
              <div>
                <p className="font-medium text-white">Serial Assignment</p>
                <p className="text-sm">Your serial number is assigned based on order sequence (1-50).</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#7F00FF] rounded-full flex items-center justify-center mt-0.5 text-sm font-bold text-white">
                2
              </div>
              <div>
                <p className="font-medium text-white">Personal Contact</p>
                <p className="text-sm">Our team will email you within 24 hours to coordinate your custom engraving.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#7F00FF] rounded-full flex items-center justify-center mt-0.5 text-sm font-bold text-white">
                3
              </div>
              <div>
                <p className="font-medium text-white">Manufacturing & Shipping</p>
                <p className="text-sm">Your chassis will be machined, finished, and shipped within 2-3 weeks.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#7F00FF]/10 to-[#4A00E0]/10 rounded-lg p-6 mb-8 border border-[#7F00FF]/20">
          <h3 className="text-lg font-bold mb-2 text-white">Exclusive Access Unlocked</h3>
          <p className="text-gray-300 text-sm">
            As a chassis owner, you now have early access to our complete RC collection launching in 2025.
          </p>
        </div>

        <div className="text-center">
          <Link 
            href="/"
            className="inline-block bg-gradient-to-r from-[#7F00FF] to-[#4A00E0] hover:from-[#9000FF] hover:to-[#5A00F0] text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Return Home
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>
            Questions? Contact us at{' '}
            <a href="mailto:info@precisionrc.com" className="text-[#7F00FF] hover:text-[#9000FF]">
              info@precisionrc.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
