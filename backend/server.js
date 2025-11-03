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

// Confirm PaymentIntent with PaymentMethod ID (from Apple Pay or other)
app.post('/api/confirm-payment-intent', async (req, res) => {
  try {
    const { client_secret, payment_method_id } = req.body;
    
    if (!client_secret || !payment_method_id) {
      return res.status(400).json({ error: 'client_secret and payment_method_id are required' });
    }
    
    // Retrieve the PaymentIntent
    const paymentIntentId = client_secret.split('_secret_')[0];
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Confirm the PaymentIntent with the PaymentMethod
    // The PaymentMethod was created on the client side using Stripe SDK
    const confirmedIntent = await stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: payment_method_id
    });
    
    console.log(`PaymentIntent confirmed: ${confirmedIntent.id}, status: ${confirmedIntent.status}`);
    
    // Check if confirmation was successful (status should be 'requires_capture' for manual capture)
    const success = confirmedIntent.status === 'requires_capture' || confirmedIntent.status === 'succeeded';
    
    res.json({
      success: success,
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
    
    console.log(`Capturing PaymentIntent ${payment_intent_id} for $${(amount_to_capture || 0) / 100}`);
    
    const paymentIntent = await stripe.paymentIntents.capture(
      payment_intent_id,
      captureOptions
    );
    
    console.log(`✅ PaymentIntent captured: ${paymentIntent.id}, amount: $${(paymentIntent.amount_captured / 100).toFixed(2)}`);
    
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

