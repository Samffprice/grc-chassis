import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { voltageToHexLabel } from '@/utils/anodize'

// Initialize Stripe - in a real app, this would use environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_secret_key_here', {
  apiVersion: '2025-08-27.basil',
})

export async function POST(request: NextRequest) {
  try {
    const { finish, anodize_t } = await request.json()
    
    const voltage = Math.round((anodize_t || 0) * 110)
    const { label } = voltageToHexLabel(voltage)

    // Check if we have Stripe configuration
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      )
    }

    // Check current inventory before creating checkout (simplified for now)
    // In a real implementation, you would check actual Stripe inventory
    const mockRemaining = Math.max(0, 50 - Math.floor(Date.now() / 100000) % 51)
    
    if (mockRemaining <= 0) {
      return NextResponse.json(
        { error: 'Product is sold out' },
        { status: 400 }
      )
    }
    
    const inventoryData = { remaining: mockRemaining }

    // Use Stripe Price ID if configured, otherwise create price_data
    const customDescription = finish === 'raw-machined' 
      ? 'Premium titanium chassis - Raw machined finish'
      : `Premium titanium chassis - ${label} (${voltage}V)`

    const lineItems = process.env.STRIPE_PRICE_ID ? [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
        // Note: When using pre-made products, the description comes from Stripe
        // Custom info is preserved in session metadata above
      }
    ] : [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Titanium RC Chassis',
            description: customDescription,
            images: ['https://via.placeholder.com/600x400/7F00FF/FFFFFF?text=Titanium+Chassis'],
          },
          unit_amount: 60000, // $600.00 in cents
        },
        quantity: 1,
      }
    ]

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      metadata: {
        finish: finish,
        product_type: 'titanium-chassis',
        anodize_level: String(anodize_t || 0),
        anodize_voltage: String(voltage),
        anodize_color: label,
        serial_number: String(51 - inventoryData.remaining), // Calculate serial number
        custom_description: customDescription, // Add this for reference
      },
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      phone_number_collection: {
        enabled: true,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      stripeKey: process.env.STRIPE_SECRET_KEY ? 'Present' : 'Missing',
      priceId: process.env.STRIPE_PRICE_ID ? 'Present' : 'Missing'
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
