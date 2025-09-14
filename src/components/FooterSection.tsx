export default function FooterSection() {
  return (
    <>
      {/* Final Perk Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#0C0C0C] to-[#050505]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="section-eyebrow-luxe justify-center mx-auto mb-5">
            <span className="dot" />
            <span className="label">Owner’s Privilege</span>
            <span className="rule" />
          </div>
          <h2 className="heading-luxe text-[30px] md:text-[40px] font-extrabold mb-5">First In Line</h2>
          <p className="copy-luxe text-lg leading-relaxed max-w-2xl mx-auto">
            Ownership grants exclusive early access to the complete collection launching in 2025.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/[0.08] bg-[#060606]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/50 mb-3">© 2024 Precision RC. All Rights Reserved.</p>
          <p className="text-white/40 text-sm">
            Questions? Contact{' '}
            <a
              href="mailto:info@precisionrc.com"
              className="underline decoration-white/20 underline-offset-4 hover:decoration-white/40"
            >
              info@precisionrc.com
            </a>
          </p>
        </div>
      </footer>
    </>
  )
}
