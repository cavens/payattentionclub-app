// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Pay Attention Club Backend API' });
});

// Create PaymentIntent endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', capture_method = 'manual', description } = req.body;
    
    // Validate amount
    if (!amount || amount < 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    
    console.log(`Creating PaymentIntent: $${(amount / 100).toFixed(2)} (${currency})`);
    
    // Create PaymentIntent with authorization hold
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: currency,
      capture_method: 'manual', // Authorization hold, not immediate charge
      payment_method_types: ['card'],
      description: description || 'Pay Attention Club - Weekly Authorization Hold',
      statement_descriptor: 'PAY ATTENTION CLUB',
      statement_descriptor_suffix: 'AUTH HOLD',
      metadata: {
        type: 'authorization_hold',
        app: 'pay_attention_club',
        timestamp: new Date().toISOString(),
        note: 'This is an authorization hold, not an immediate charge. You will only be charged for actual usage penalties.'
      }
    });
    
    console.log(`PaymentIntent created: ${paymentIntent.id}`);
    
    res.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    res.status(500).json({ 
      error: error.message,
      type: error.type || 'unknown_error'
    });
  }
});

// Confirm PaymentIntent with Apple Pay token
app.post('/api/confirm-payment-intent', async (req, res) => {
  try {
    const { client_secret, payment_data } = req.body;
    
    if (!client_secret || !payment_data) {
      return res.status(400).json({ error: 'client_secret and payment_data are required' });
    }
    
    // Decode base64 payment data (Apple Pay token format)
    const paymentDataBuffer = Buffer.from(payment_data, 'base64');
    const paymentData = JSON.parse(paymentDataBuffer.toString());
    
    // Retrieve the PaymentIntent
    const paymentIntentId = client_secret.split('_secret_')[0];
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Apple Pay provides encrypted token - Stripe needs payment method
    // We'll create a PaymentMethod using Stripe's Apple Pay token
    // Note: In production, you'd use Stripe's iOS SDK to convert PKPayment to PaymentMethod
    // For now, we'll use a simplified approach: create payment method from token
    
    // Create PaymentMethod from Apple Pay payment data
    // Stripe expects the token in a specific format from Apple Pay
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        token: paymentData.id || paymentData.token // Apple Pay token identifier
      }
    });
    
    // Confirm the PaymentIntent with the payment method
    const confirmedIntent = await stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: paymentMethod.id
    });
    
    console.log(`PaymentIntent confirmed: ${confirmedIntent.id}, status: ${confirmedIntent.status}`);
    
    res.json({
      success: true,
      payment_intent_id: confirmedIntent.id,
      status: confirmedIntent.status
    });
  } catch (error) {
    console.error('Error confirming PaymentIntent:', error);
    res.status(500).json({ 
      error: error.message,
      type: error.type || 'unknown_error'
    });
  }
});

// Capture PaymentIntent (for week settlement)
app.post('/api/capture-payment-intent', async (req, res) => {
  try {
    const { payment_intent_id, amount_to_capture } = req.body;
    
    if (!payment_intent_id) {
      return res.status(400).json({ error: 'payment_intent_id is required' });
    }
    
    const captureOptions = amount_to_capture 
      ? { amount_to_capture: amount_to_capture }
      : {}; // Capture full amount if not specified
    
    const paymentIntent = await stripe.paymentIntents.capture(
      payment_intent_id,
      captureOptions
    );
    
    console.log(`PaymentIntent captured: ${paymentIntent.id}`);
    
    res.json({
      success: true,
      payment_intent_id: paymentIntent.id,
      amount_captured: paymentIntent.amount_captured
    });
  } catch (error) {
    console.error('Error capturing PaymentIntent:', error);
    res.status(500).json({ 
      error: error.message,
      type: error.type || 'unknown_error'
    });
  }
});

// Release PaymentIntent (cancel authorization hold)
app.post('/api/release-payment-intent', async (req, res) => {
  try {
    const { payment_intent_id } = req.body;
    
    if (!payment_intent_id) {
      return res.status(400).json({ error: 'payment_intent_id is required' });
    }
    
    // Cancel the PaymentIntent (releases the hold)
    const paymentIntent = await stripe.paymentIntents.cancel(payment_intent_id);
    
    console.log(`PaymentIntent cancelled: ${paymentIntent.id}`);
    
    res.json({
      success: true,
      payment_intent_id: paymentIntent.id,
      status: paymentIntent.status
    });
  } catch (error) {
    console.error('Error releasing PaymentIntent:', error);
    res.status(500).json({ 
      error: error.message,
      type: error.type || 'unknown_error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Pay Attention Club Backend API running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`💳 Create PaymentIntent: POST http://localhost:${PORT}/api/create-payment-intent`);
  
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('⚠️  WARNING: STRIPE_SECRET_KEY environment variable not set!');
    console.warn('   Set it in your .env file or environment variables');
  }
});

