# Titanium RC Chassis - Premium Pre-Order Site

A high-end, single-page application for pre-ordering serialized titanium RC chassis units. Built with Next.js, TypeScript, and Stripe integration.

## 🚀 Features

- **Live Inventory Counter**: Real-time display of remaining units (X/50)
- **Interactive Color Selector**: Choose from Titanium Purple, Raw Machined, or Space Black finishes
- **Stripe Checkout Integration**: Secure payment processing with metadata for finish selection
- **Responsive Design**: Premium mobile-first design with Tailwind CSS
- **Smooth Scrolling**: Single-page application with section navigation
- **Mock Inventory System**: Development-ready with simulated inventory decrements

## 🛠 Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Stripe** for payments
- **React Context API** for state management
- **Inter Font** for professional typography

## 📦 Installation

1. **Clone and navigate to the project:**
   ```bash
   cd grc-chassis
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file with:
   ```env
   # Stripe Configuration
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   
   # Product Configuration  
   STRIPE_PRODUCT_ID=prod_your_product_id_here
   STRIPE_PRICE_ID=price_your_price_id_here
   
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 🎨 Design System

### Color Palette
- **Background**: Deep Space Grey (`#1A1A1A`)
- **Accent**: Anodized Purple Gradient (`#7F00FF` to `#4A00E0`)
- **Text**: Crisp White (`#FFFFFF`) and Light Grey (`#E5E5E5`)

### Typography
- **Primary Font**: Inter (engineered, confident feel)
- **Headlines**: Bold, gradient text effects
- **Body**: Clean, readable sans-serif

### Brand Voice
- **Tone**: Confident, precise, exclusive
- **Tagline**: "Perfection is Non-Negotiable"
- **Target**: High-end RC enthusiasts who value quality

## 🔧 Configuration

### Stripe Setup
1. Create a new product in your Stripe Dashboard
2. Set inventory tracking to "Tracked" with quantity: 50
3. Note the Product ID and Price ID for environment variables
4. Configure success/cancel URLs in your Stripe settings

### Content Customization
- Replace placeholder images in components with actual product renders
- Update company details in `FooterSection.tsx`
- Modify pricing in `checkout/route.ts`
- Customize finish options in `ConversionSection.tsx`

## 📱 Components

### Core Sections
- **HeroSection**: Above-fold hero with live counter and CTA
- **ProofSection**: Three-module alternating layout showcasing features
- **ConversionSection**: Interactive color selector and checkout form
- **FooterSection**: Final value proposition and contact information

### API Routes
- **`/api/inventory`**: Returns current inventory count
- **`/api/checkout`**: Creates Stripe checkout session with finish metadata

## 🚀 Deployment

1. **Vercel (Recommended):**
   ```bash
   npm run build
   vercel --prod
   ```

2. **Environment Variables:**
   - Add all `.env.local` variables to your deployment platform
   - Update `NEXT_PUBLIC_SITE_URL` to your production domain

3. **Stripe Configuration:**
   - Update webhook URLs in Stripe Dashboard
   - Set up production keys for live payments

## 🔄 Development Notes

### Current Mock Implementation
- Inventory API uses time-based mock data
- Replace with actual Stripe product queries for production
- Checkout creates real Stripe sessions but uses placeholder product data

### Future Enhancements
- Real-time inventory updates via Stripe webhooks
- Image optimization for product renders
- SEO optimization with proper meta tags
- Analytics integration (Google Analytics, etc.)

## 📊 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── inventory/route.ts    # Live inventory count
│   │   └── checkout/route.ts     # Stripe checkout session
│   ├── success/page.tsx          # Post-purchase confirmation
│   ├── layout.tsx                # Root layout with providers
│   └── page.tsx                  # Main landing page
├── components/
│   ├── HeroSection.tsx           # Hero section with CTA
│   ├── ProofSection.tsx          # Feature proof modules
│   ├── ConversionSection.tsx     # Checkout and color selection
│   └── FooterSection.tsx         # Footer and final CTA
└── context/
    └── AppContext.tsx            # Global state management
```

## 🎯 Success Metrics

The site is designed to convert high-end RC enthusiasts through:
- **Scarcity**: Limited to 50 serialized units
- **Quality**: American-made titanium construction
- **Exclusivity**: Early access to future product releases
- **Personalization**: Custom engraving service

## 📞 Support

For questions about setup or customization, refer to the `CURSOR_MEMORY.md` file for detailed architecture decisions and implementation notes.