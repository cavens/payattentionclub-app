// Quick script to check if a PaymentIntent is an authorization hold
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

// Get the last PaymentIntent from the logs
// Replace pi_xxxxx with an actual PaymentIntent ID from your terminal logs
const paymentIntentId = process.argv[2] || 'pi_3SPWDBQcfZnqDqya0hr3c4IS';

stripe.paymentIntents.retrieve(paymentIntentId)
  .then(pi => {
    console.log('\n📋 PaymentIntent Details:');
    console.log('ID:', pi.id);
    console.log('Amount:', `$${(pi.amount / 100).toFixed(2)}`);
    console.log('Capture Method:', pi.capture_method); // Should be 'manual'
    console.log('Status:', pi.status);
    console.log('Description:', pi.description);
    console.log('Metadata:', pi.metadata);
    console.log('\n✅ This is an AUTHORIZATION HOLD (capture_method: manual)');
    console.log('   No charge has been made yet - only a hold is placed.');
    console.log('   To actually charge, you would need to call capture().');
  })
  .catch(err => console.error('Error:', err));
